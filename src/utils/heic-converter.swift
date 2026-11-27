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

func writePreservingGainMap(from source: CGImageSource, to url: URL) -> Bool {
    guard let dst = CGImageDestinationCreateWithURL(
        url as CFURL,
        UTType.jpeg.identifier as CFString,
        1,
        nil
    ) else {
        return false
    }

    let options: [CFString: Any] = [
        kCGImageDestinationLossyCompressionQuality: 0.95,
        kCGImageDestinationPreserveGainMap: true
    ]
    CGImageDestinationAddImageFromSource(dst, source, 0, options as CFDictionary)
    guard CGImageDestinationFinalize(dst),
          let data = try? Data(contentsOf: url) else {
        return false
    }
    // Only keep ImageIO's direct transcode when it produced standard ISO 21496-1 metadata
    // (avoids legacy Apple MPF JPEGs that fail sharp.keepGainMap()).
    return data.range(of: isoMarker) != nil
}

let context = CIContext()

do {
    if isHdr, let hdr = hdrImg {
        // Prefer direct ImageIO gain-map preservation (bit-for-bit identical ISO 21496-1 tmap metadata,
        // zero brightness shift); fall back to CoreImage HDR encoding for legacy pre-iOS 18 HEICs.
        if !writePreservingGainMap(from: imgSrc, to: outputURL) {
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
