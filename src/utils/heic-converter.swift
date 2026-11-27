import Foundation
import CoreImage
import ImageIO
import UniformTypeIdentifiers

func fail(_ message: String) -> Never {
    FileHandle.standardError.write(Data((message + "\n").utf8))
    exit(1)
}

let args = Array(CommandLine.arguments.dropFirst())
var forceSdr = false
var positional: [String] = []

for arg in args {
    if arg == "--sdr" {
        forceSdr = true
    } else {
        positional.append(arg)
    }
}

guard positional.count == 2 else {
    fail("Usage: heic-convert <input.heic> <output-file> [--sdr]")
}

let inputURL = URL(fileURLWithPath: positional[0])
let outputURL = URL(fileURLWithPath: positional[1])

guard let imgSrc = CGImageSourceCreateWithURL(inputURL as CFURL, nil) else {
    fail("Failed to open image source: \(inputURL.path)")
}

let hasGainMap = CGImageSourceCopyAuxiliaryDataInfoAtIndex(
    imgSrc,
    0,
    kCGImageAuxiliaryDataTypeHDRGainMap
) != nil

guard let sdrImg = CIImage(contentsOf: inputURL, options: [.applyOrientationProperty: true]) else {
    fail("Failed to decode SDR image: \(inputURL.path)")
}

let fallbackCS = CGColorSpace(name: CGColorSpace.displayP3) ?? CGColorSpaceCreateDeviceRGB()
let colorSpace: CGColorSpace
if let cs = sdrImg.colorSpace, cs.model == .rgb, !CGColorSpaceUsesExtendedRange(cs) {
    colorSpace = cs
} else {
    colorSpace = fallbackCS
}

var isHdr = false
var headroom: Float = 1.0
var hdrImg: CIImage? = nil

if !forceSdr,
   let expanded = CIImage(contentsOf: inputURL, options: [.applyOrientationProperty: true, .expandToHDR: true]) {
    let h = expanded.contentHeadroom
    if hasGainMap || h > 1.01 {
        isHdr = true
        headroom = max(h, 1.0)
        hdrImg = expanded
    }
}

let isoMarker = Data("urn:iso:std:iso:ts:21496:-1".utf8)
let context = CIContext()

// Bake EXIF orientation into both primary pixels and ISO gain map (orientation = 1)
// so downstream sharp().rotate().keepGainMap() avoids libvips autorot+gainmap bugs
// while preserving bit-for-bit ISO 21496-1 metadata (zero brightness shift).
func writeUprightIsoGainMapJpeg(
    from source: CGImageSource,
    sdrImage: CIImage,
    colorSpace: CGColorSpace,
    to url: URL
) -> Bool {
    guard #available(macOS 15.0, *),
          let isoDict = CGImageSourceCopyAuxiliaryDataInfoAtIndex(
              source,
              0,
              kCGImageAuxiliaryDataTypeISOGainMap
          ) as? [CFString: Any],
          let auxData = isoDict[kCGImageAuxiliaryDataInfoData] as? Data,
          let auxDesc = isoDict[kCGImageAuxiliaryDataInfoDataDescription] as? [CFString: Any],
          let auxW = auxDesc[kCGImagePropertyWidth] as? Int,
          let auxH = auxDesc[kCGImagePropertyHeight] as? Int,
          let auxBPR = auxDesc[kCGImagePropertyBytesPerRow] as? Int,
          let auxPixFmt = auxDesc[kCGImagePropertyPixelFormat] as? UInt32,
          // 1-channel 8-bit grayscale ('L008' / kCVPixelFormatType_OneComponent8)
          auxPixFmt == 1278226488 else {
        return false
    }

    guard let primaryCG = context.createCGImage(
        sdrImage,
        from: sdrImage.extent,
        format: .RGBA8,
        colorSpace: colorSpace
    ) else {
        return false
    }

    let props = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any]
    let orientRaw = (props?[kCGImagePropertyOrientation] as? UInt32) ?? 1

    var newIsoDict = isoDict
    if orientRaw != 1 {
        let grayCS = CGColorSpaceCreateDeviceGray()
        guard let provider = CGDataProvider(data: auxData as CFData),
              let auxCG = CGImage(
                  width: auxW,
                  height: auxH,
                  bitsPerComponent: 8,
                  bitsPerPixel: 8,
                  bytesPerRow: auxBPR,
                  space: grayCS,
                  bitmapInfo: CGBitmapInfo(rawValue: 0),
                  provider: provider,
                  decode: nil,
                  shouldInterpolate: false,
                  intent: .defaultIntent
              ) else {
            return false
        }

        let auxCI = CIImage(cgImage: auxCG).oriented(forExifOrientation: Int32(orientRaw))
        guard let rotCG = context.createCGImage(auxCI, from: auxCI.extent, format: .L8, colorSpace: grayCS),
              let rotData = rotCG.dataProvider?.data as Data? else {
            return false
        }

        var newDesc = auxDesc
        newDesc[kCGImagePropertyWidth] = rotCG.width
        newDesc[kCGImagePropertyHeight] = rotCG.height
        newDesc[kCGImagePropertyBytesPerRow] = rotCG.bytesPerRow
        newIsoDict[kCGImageAuxiliaryDataInfoData] = rotData as CFData
        newIsoDict[kCGImageAuxiliaryDataInfoDataDescription] = newDesc
    }

    guard let dst = CGImageDestinationCreateWithURL(
        url as CFURL,
        UTType.jpeg.identifier as CFString,
        1,
        nil
    ) else {
        return false
    }

    CGImageDestinationAddImage(dst, primaryCG, [
        kCGImageDestinationLossyCompressionQuality: 0.95,
        kCGImagePropertyOrientation: 1
    ] as CFDictionary)
    CGImageDestinationAddAuxiliaryDataInfo(
        dst,
        kCGImageAuxiliaryDataTypeISOGainMap,
        newIsoDict as CFDictionary
    )

    guard CGImageDestinationFinalize(dst),
          let data = try? Data(contentsOf: url) else {
        return false
    }

    return data.range(of: isoMarker) != nil
}

do {
    if isHdr, let hdr = hdrImg {
        // Prefer upright ISO 21496-1 gain-map preservation (exact metadata, zero brightness shift);
        // fall back to CoreImage HDR encoding for legacy pre-iOS 18 or multi-channel HEICs.
        if !writeUprightIsoGainMapJpeg(from: imgSrc, sdrImage: sdrImg, colorSpace: colorSpace, to: outputURL) {
            try context.writeJPEGRepresentation(
                of: sdrImg,
                to: outputURL,
                colorSpace: colorSpace,
                options: [
                    kCGImageDestinationLossyCompressionQuality as CIImageRepresentationOption: 0.95,
                    CIImageRepresentationOption.hdrImage: hdr
                ]
            )
        }
    } else {
        try context.writeTIFFRepresentation(
            of: sdrImg,
            to: outputURL,
            format: .RGBA8,
            colorSpace: colorSpace
        )
    }
} catch {
    fail("Failed to convert HEIC image: \(error.localizedDescription)")
}

let result: [String: Any] = [
    "isHdr": isHdr,
    "width": Int(sdrImg.extent.width.rounded()),
    "height": Int(sdrImg.extent.height.rounded()),
    "headroom": Double(headroom)
]

guard let jsonData = try? JSONSerialization.data(withJSONObject: result),
      let jsonStr = String(data: jsonData, encoding: .utf8) else {
    fail("Failed to serialize conversion result")
}

print(jsonStr)
