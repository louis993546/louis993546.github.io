import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// MPF APP2 segment generator for 2-image Apple/ISO HDR JPEGs
function createExactMpfSegment(primaryLen, secondaryLen, mpfTiffOffset) {
  const mpf = Buffer.alloc(88);
  // Marker & Length (Photomator and Apple use 0x0058 = 88)
  mpf.writeUInt16BE(0xFFE2, 0);
  mpf.writeUInt16BE(88, 2);
  mpf.write('MPF\0', 4, 'ascii');
  
  // TIFF Header: MM (Big Endian)
  mpf.write('MM\0\x2A', 8, 'binary');
  mpf.writeUInt32BE(8, 12); // IFD0 offset from TIFF header

  // IFD0: 3 tags
  mpf.writeUInt16BE(3, 16);

  // Tag 1: MPFVersion (0xB000, UNDEFINED, count 4, '0100')
  mpf.writeUInt16BE(0xB000, 18);
  mpf.writeUInt16BE(7, 20);
  mpf.writeUInt32BE(4, 22);
  mpf.write('0100', 26, 'ascii');

  // Tag 2: NumberOfImages (0xB001, LONG, count 1, value 2)
  mpf.writeUInt16BE(0xB001, 30);
  mpf.writeUInt16BE(4, 32);
  mpf.writeUInt32BE(1, 34);
  mpf.writeUInt32BE(2, 38);

  // Tag 3: MPEntry (0xB002, UNDEFINED, count 32, value offset 50)
  mpf.writeUInt16BE(0xB002, 42);
  mpf.writeUInt16BE(7, 44);
  mpf.writeUInt32BE(32, 46);
  mpf.writeUInt32BE(50, 50);

  // Next IFD = 0
  mpf.writeUInt32BE(0, 54);

  // Entry 1 (Primary Image) - 16 bytes at offset 58
  mpf.writeUInt32BE(0x030000, 58);  // Attribute: First Individual Image
  mpf.writeUInt32BE(primaryLen, 62); // Primary image size
  mpf.writeUInt32BE(0, 66);          // Offset = 0
  mpf.writeUInt16BE(0, 70);          // Dep 1
  mpf.writeUInt16BE(0, 72);          // Dep 2

  // Entry 2 (Secondary Gain Map) - 16 bytes at offset 74
  mpf.writeUInt32BE(0x000000, 74);   // Attribute: Undefined
  mpf.writeUInt32BE(secondaryLen, 78); // Secondary image size
  const secOffsetFromTiff = primaryLen - mpfTiffOffset;
  mpf.writeUInt32BE(secOffsetFromTiff, 82); // Offset from TIFF header
  mpf.writeUInt16BE(0, 86);          // Dep 1

  return mpf;
}

// Extract all APP segments from JPEG buffer
function extractAllAppSegments(buf) {
  const segments = [];
  let offset = 2;
  while (offset < buf.length - 1) {
    if (buf[offset] !== 0xFF) {
      offset++;
      continue;
    }
    const marker = buf[offset + 1];
    if (marker === 0xDA || marker === 0xD9) break;
    if (marker >= 0xE0 && marker <= 0xEF) {
      const len = buf.readUInt16BE(offset + 2);
      const appNum = marker - 0xE0;
      const data = buf.subarray(offset, offset + 2 + len);
      segments.push({ marker, appNum, len, data, offset });
      offset += 2 + len;
    } else {
      offset += 2;
    }
  }
  return segments;
}

// Find secondary JPEG offset using MPF header or SOI scan
function findSecondaryJpegOffset(buf) {
  const mpfIdx = buf.indexOf(Buffer.from('MPF\0'));
  if (mpfIdx !== -1 && mpfIdx + 80 <= buf.length) {
    const tiffOffset = mpfIdx + 4;
    const entry2Offset = buf.readUInt32BE(mpfIdx + 74);
    const candidateOffset = tiffOffset + entry2Offset;
    if (candidateOffset < buf.length && buf[candidateOffset] === 0xFF && buf[candidateOffset + 1] === 0xD8) {
      return candidateOffset;
    }
  }

  let searchPos = 10000;
  while (searchPos < buf.length - 2) {
    const idx = buf.indexOf(Buffer.from([0xFF, 0xD8]), searchPos);
    if (idx === -1) break;
    if (idx + 3 < buf.length && buf[idx + 2] === 0xFF && (buf[idx + 3] === 0xE1 || buf[idx + 3] === 0xE2 || buf[idx + 3] === 0xEA)) {
      return idx;
    }
    searchPos = idx + 2;
  }
  return -1;
}

// Create Universal Gain Map XMP segment (Apple + ISO 21496-1 compliant)
function createGainMapXmpSegment(width, height) {
  const xmpString = `http://ns.adobe.com/xap/1.0/\0<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="XMP Core 6.0.0"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:exif="http://ns.adobe.com/exif/1.0/" xmlns:apdi="http://ns.apple.com/pixeldatainfo/1.0/" xmlns:HDRGainMap="http://ns.apple.com/HDRGainMap/1.0/" xmlns:hdrgm="http://ns.adobe.com/hdr-gain-map/1.0/" xmlns:xmp="http://ns.adobe.com/xap/1.0/"><exif:PixelYDimension>${height}</exif:PixelYDimension><exif:PixelXDimension>${width}</exif:PixelXDimension><apdi:NativeFormat>1278226488</apdi:NativeFormat><apdi:AuxiliaryImageType>urn:com:apple:photo:2020:aux:hdrgainmap</apdi:AuxiliaryImageType><apdi:StoredFormat>1278226488</apdi:StoredFormat><HDRGainMap:HDRGainMapVersion>65536</HDRGainMap:HDRGainMapVersion><hdrgm:Version>1.0</hdrgm:Version><hdrgm:GainMapMin>0.0</hdrgm:GainMapMin><hdrgm:GainMapMax>1.0</hdrgm:GainMapMax><hdrgm:Gamma>1.0</hdrgm:Gamma><hdrgm:OffsetSDR>0.0</hdrgm:OffsetSDR><hdrgm:OffsetHDR>0.0</hdrgm:OffsetHDR><hdrgm:HDRCapacityMin>0.0</hdrgm:HDRCapacityMin><hdrgm:HDRCapacityMax>1.0</hdrgm:HDRCapacityMax><hdrgm:BaseRenditionIsHDR>False</hdrgm:BaseRenditionIsHDR></rdf:Description></rdf:RDF></x:xmpmeta>`;
  const payload = Buffer.from(xmpString, 'utf8');
  const segment = Buffer.alloc(4 + payload.length);
  segment.writeUInt16BE(0xFFE1, 0);
  segment.writeUInt16BE(2 + payload.length, 2);
  payload.copy(segment, 4);
  return segment;
}

export async function processHdrImage(inputPath, outputDir = '_site/assets/images/processed') {
  if (!fs.existsSync(inputPath)) {
    return null;
  }

  const fileBuf = fs.readFileSync(inputPath);
  const hash = crypto.createHash('md5').update(fileBuf).digest('hex').slice(0, 10);
  const baseName = path.basename(inputPath, path.extname(inputPath));
  
  const cacheDir = path.join('.cache', 'hdr-pipeline', hash);
  const targetDistDir = path.join(outputDir, hash);
  
  const widths = [800, 1200, 1600];
  const secOffset = findSecondaryJpegOffset(fileBuf);
  const isAppleHdr = secOffset > 0 && fileBuf.toString('binary').includes('MPF\0');

  const meta = await sharp(fileBuf.subarray(0, isAppleHdr ? secOffset : fileBuf.length)).metadata();
  const targetWidths = widths.filter(w => w <= meta.width);
  if (targetWidths.length === 0) targetWidths.push(meta.width);

  const results = {
    hash,
    width: meta.width,
    height: meta.height,
    isHdr: isAppleHdr,
    jpgSources: [],
    fallbackUrl: ''
  };

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });

    const primaryBuf = isAppleHdr ? fileBuf.subarray(0, secOffset) : fileBuf;
    const secondaryBuf = isAppleHdr ? fileBuf.subarray(secOffset) : null;

    const primSegments = isAppleHdr ? extractAllAppSegments(primaryBuf) : [];
    const secSegments = isAppleHdr && secondaryBuf ? extractAllAppSegments(secondaryBuf) : [];

    const primApp10 = primSegments.find(s => s.appNum === 10);
    const secApp10 = secSegments.find(s => s.appNum === 10);

    for (const w of targetWidths) {
      // 1. Resized Primary Image
      const primResized = await sharp(primaryBuf)
        .resize(w)
        .withMetadata()
        .jpeg({ quality: 85 })
        .toBuffer();

      let finalJpgBuf = primResized;

      if (isAppleHdr && secondaryBuf) {
        // Calculate target secondary height proportionally
        const targetHeight = Math.round((w / meta.width) * meta.height);

        // 2. Resized Secondary Gain Map Image
        const secResized = await sharp(secondaryBuf)
          .resize(w)
          .jpeg({ quality: 85, chromaSubsampling: '4:2:0' })
          .toBuffer();

        // 3. Gain Map XMP & Apple AROT Header
        const gainMapXmp = createGainMapXmpSegment(w, targetHeight);
        const secHeaderSegments = [gainMapXmp];
        if (secApp10) secHeaderSegments.push(secApp10.data);

        const finalSecondary = Buffer.concat([
          secResized.subarray(0, 2), // SOI 0xFFD8
          ...secHeaderSegments,
          secResized.subarray(2)     // Scanned gain map data
        ]);

        // 4. Find insertion position in primary (after existing APP segments)
        let insertPos = 2;
        while (insertPos < primResized.length - 1) {
          if (primResized[insertPos] !== 0xFF) break;
          const m = primResized[insertPos + 1];
          if (m >= 0xE0 && m <= 0xEF) {
            const len = primResized.readUInt16BE(insertPos + 2);
            insertPos += 2 + len;
          } else {
            break;
          }
        }

        const primWithApp10 = primApp10 ? Buffer.concat([
          primResized.subarray(0, insertPos),
          primApp10.data,
          primResized.subarray(insertPos)
        ]) : primResized;

        // MPF TIFF header is at insertPos + 8 (0xFFE2 + length + 'MPF\0')
        const mpfTiffOffset = insertPos + 8;
        const totalPrimaryLen = primWithApp10.length + 88;

        const mpfSeg = createExactMpfSegment(totalPrimaryLen, finalSecondary.length, mpfTiffOffset);

        const finalPrimary = Buffer.concat([
          primWithApp10.subarray(0, insertPos),
          mpfSeg,
          primWithApp10.subarray(insertPos)
        ]);

        finalJpgBuf = Buffer.concat([finalPrimary, finalSecondary]);
      }

      // Save JPEG
      const filename = isAppleHdr ? `${baseName}-${w}w-hdr.jpg` : `${baseName}-${w}w.jpg`;
      fs.writeFileSync(path.join(cacheDir, filename), finalJpgBuf);
    }
  }

  // Ensure target dist directory exists in _site
  fs.mkdirSync(targetDistDir, { recursive: true });
  
  // Copy cached files to dist output directory
  const files = fs.readdirSync(cacheDir);
  for (const f of files) {
    fs.copyFileSync(path.join(cacheDir, f), path.join(targetDistDir, f));
  }

  const webDistPath = `/assets/images/processed/${hash}`;

  for (const w of targetWidths) {
    const filename = isAppleHdr ? `${baseName}-${w}w-hdr.jpg` : `${baseName}-${w}w.jpg`;
    results.jpgSources.push(`${webDistPath}/${filename} ${w}w`);
  }

  const defaultWidth = targetWidths[Math.floor(targetWidths.length / 2)] || targetWidths[0];
  const defaultFilename = isAppleHdr ? `${baseName}-${defaultWidth}w-hdr.jpg` : `${baseName}-${defaultWidth}w.jpg`;
  results.fallbackUrl = `${webDistPath}/${defaultFilename}`;

  return results;
}
