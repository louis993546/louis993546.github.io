import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// MPF APP2 segment generator for 2-image Apple HDR JPEGs
function createMpfApp2Segment(primaryTotalLen, secondaryTotalLen, mpfTiffOffsetInPrimary) {
  const mpfBuf = Buffer.alloc(88);
  mpfBuf.writeUInt16BE(0xFFE2, 0); // APP2 marker
  mpfBuf.writeUInt16BE(86, 2);     // Segment length excluding 2-byte marker
  mpfBuf.write('MPF\0', 4, 'ascii');
  
  // TIFF Header: Big Endian MM, Tag 0x002A, IFD0 offset = 8
  mpfBuf.write('MM\0\x2A', 8, 'binary');
  mpfBuf.writeUInt32BE(8, 12);
  
  // IFD0 count = 3 tags
  mpfBuf.writeUInt16BE(3, 16);
  
  // Tag 1: MPFVersion (0xB000, UNDEFINED, 4 bytes, '0100')
  mpfBuf.writeUInt16BE(0xB000, 18);
  mpfBuf.writeUInt16BE(7, 20);
  mpfBuf.writeUInt32BE(4, 22);
  mpfBuf.write('0100', 26, 'ascii');

  // Tag 2: NumberOfImages (0xB001, LONG, 1 count, 2 images)
  mpfBuf.writeUInt16BE(0xB001, 30);
  mpfBuf.writeUInt16BE(4, 32);
  mpfBuf.writeUInt32BE(1, 34);
  mpfBuf.writeUInt32BE(2, 38);

  // Tag 3: MPEntry (0xB002, UNDEFINED, 32 bytes, value offset 50)
  mpfBuf.writeUInt16BE(0xB002, 42);
  mpfBuf.writeUInt16BE(7, 44);
  mpfBuf.writeUInt32BE(32, 46);
  mpfBuf.writeUInt32BE(50, 50);

  // Next IFD = 0
  mpfBuf.writeUInt32BE(0, 54);

  // Primary image entry
  mpfBuf.writeUInt32BE(0x030000, 58);
  mpfBuf.writeUInt32BE(primaryTotalLen, 62);
  mpfBuf.writeUInt32BE(0, 66);
  mpfBuf.writeUInt16BE(0, 70);

  // Secondary image (Gain Map) entry
  mpfBuf.writeUInt32BE(0x000000, 74);
  mpfBuf.writeUInt32BE(secondaryTotalLen, 78);
  // Offset relative to TIFF header in primary JPEG
  const secOffsetFromTiff = primaryTotalLen - mpfTiffOffsetInPrimary;
  mpfBuf.writeUInt32BE(secOffsetFromTiff, 82);
  mpfBuf.writeUInt16BE(0, 86);

  return mpfBuf;
}

// Find secondary JPEG offset from MPF tag or fallback search
function findSecondaryJpegOffset(buf) {
  const mpfIdx = buf.indexOf(Buffer.from('MPF\0'));
  if (mpfIdx !== -1 && mpfIdx + 78 <= buf.length) {
    const tiffOffset = mpfIdx + 4; // 'MM\0\x2A' starts 4 bytes after 'MPF\0'
    const entry2Offset = buf.readUInt32BE(mpfIdx + 74); // offset of entry 2 from TIFF header
    const candidateOffset = tiffOffset + entry2Offset;
    if (candidateOffset < buf.length && buf[candidateOffset] === 0xFF && buf[candidateOffset + 1] === 0xD8) {
      return candidateOffset;
    }
  }

  // Fallback: scan for SOI after offset 50000
  let searchPos = 50000;
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

// Extract APP segment by marker from buffer (e.g. 0xEA for APP10)
function extractAppSegment(buf, appMarker) {
  let offset = 2;
  while (offset < buf.length - 1) {
    if (buf[offset] !== 0xFF) {
      offset++;
      continue;
    }
    const marker = buf[offset + 1];
    if (marker === 0xDA || marker === 0xD9) break;
    if (marker === appMarker) {
      const len = buf.readUInt16BE(offset + 2);
      return buf.subarray(offset, offset + 2 + len);
    }
    if (marker >= 0xE0 && marker <= 0xEF) {
      const len = buf.readUInt16BE(offset + 2);
      offset += 2 + len;
    } else {
      offset += 2;
    }
  }
  return null;
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

    // Extract original Apple APP segments
    const primaryApp10 = isAppleHdr ? extractAppSegment(primaryBuf, 0xEA) : null;
    const secXmp = isAppleHdr && secondaryBuf ? extractAppSegment(secondaryBuf, 0xE1) : null;
    const secApp10 = isAppleHdr && secondaryBuf ? extractAppSegment(secondaryBuf, 0xEA) : null;

    for (const w of targetWidths) {
      // 1. Resized Primary Image
      const primaryResized = await sharp(primaryBuf)
        .resize(w)
        .withMetadata()
        .jpeg({ quality: 85 })
        .toBuffer();

      let finalJpgBuf = primaryResized;

      if (isAppleHdr && secondaryBuf) {
        // 2. Resized Secondary Gain Map Image
        const secondaryRaw = await sharp(secondaryBuf)
          .resize(w)
          .jpeg({ quality: 85, chromaSubsampling: '4:2:0' })
          .toBuffer();

        // Assemble secondary JPEG with original XMP and APP10 segments
        const secSegments = [];
        if (secXmp) secSegments.push(secXmp);
        if (secApp10) secSegments.push(secApp10);

        const secondaryClean = Buffer.concat([
          secondaryRaw.subarray(0, 2), // SOI (0xFFD8)
          ...secSegments,
          secondaryRaw.subarray(2)     // rest of image
        ]);

        // Find position after all APP markers in primary image
        let insertPos = 2;
        while (insertPos < primaryResized.length - 1) {
          if (primaryResized[insertPos] !== 0xFF) break;
          const m = primaryResized[insertPos + 1];
          if (m >= 0xE0 && m <= 0xEF) {
            const len = primaryResized.readUInt16BE(insertPos + 2);
            insertPos += 2 + len;
          } else {
            break;
          }
        }

        const primaryWithApp10 = primaryApp10 ? Buffer.concat([
          primaryResized.subarray(0, insertPos),
          primaryApp10,
          primaryResized.subarray(insertPos)
        ]) : primaryResized;

        const totalPrimaryLen = primaryWithApp10.length + 88;
        const mpfTiffOffset = insertPos + 4;
        const mpfSeg = createMpfApp2Segment(totalPrimaryLen, secondaryClean.length, mpfTiffOffset);

        const finalPrimary = Buffer.concat([
          primaryWithApp10.subarray(0, insertPos),
          mpfSeg,
          primaryWithApp10.subarray(insertPos)
        ]);

        finalJpgBuf = Buffer.concat([finalPrimary, secondaryClean]);
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
