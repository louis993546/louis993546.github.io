import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// MPF APP2 segment generator for 2-image Apple HDR JPEGs
function createMpfApp2Segment(primaryLen, secondaryLen) {
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

  const fullPrimaryLen = primaryLen + 88;

  // Primary image entry
  mpfBuf.writeUInt32BE(0x030000, 58);
  mpfBuf.writeUInt32BE(fullPrimaryLen, 62);
  mpfBuf.writeUInt32BE(0, 66);
  mpfBuf.writeUInt16BE(0, 70);

  // Secondary image (Gain Map) entry
  mpfBuf.writeUInt32BE(0x000000, 74);
  mpfBuf.writeUInt32BE(secondaryLen, 78);
  mpfBuf.writeUInt32BE(fullPrimaryLen - 8, 82);
  mpfBuf.writeUInt16BE(0, 86);

  return mpfBuf;
}

// Find secondary JPEG offset in Apple dual-stream MPF JPEGs
function findSecondaryJpegOffset(buf) {
  let searchPos = 1000;
  while (searchPos < buf.length - 2) {
    const idx = buf.indexOf(Buffer.from([0xFF, 0xD8]), searchPos);
    if (idx === -1) break;
    
    // Check if followed by APP1 or APP2 tag (typical for gain map image)
    if (idx + 3 < buf.length && buf[idx + 2] === 0xFF && (buf[idx + 3] === 0xE1 || buf[idx + 3] === 0xE2 || buf[idx + 3] === 0xDB)) {
      return idx;
    }
    searchPos = idx + 2;
  }
  return -1;
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
    hdrJpgSources: [],
    avifSources: [],
    webpSources: [],
    fallbackUrl: ''
  };

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });

    const primaryBuf = isAppleHdr ? fileBuf.subarray(0, secOffset) : fileBuf;
    const secondaryBuf = isAppleHdr ? fileBuf.subarray(secOffset) : null;

    for (const w of targetWidths) {
      // 1. Resized Primary Image
      const primaryResized = await sharp(primaryBuf)
        .resize(w)
        .withMetadata()
        .jpeg({ quality: 85 })
        .toBuffer();

      let finalHdrJpgBuf = primaryResized;

      if (isAppleHdr && secondaryBuf) {
        // 2. Resized Secondary Gain Map Image
        const secondaryResized = await sharp(secondaryBuf)
          .resize(w)
          .withMetadata()
          .jpeg({ quality: 85, chromaSubsampling: '4:2:0' })
          .toBuffer();

        // 3. Inject MPF segment into primary image after initial APP segment
        const mpfSeg = createMpfApp2Segment(primaryResized.length, secondaryResized.length);
        let insertPos = 2;
        if (primaryResized.readUInt16BE(2) >= 0xFFE0 && primaryResized.readUInt16BE(2) <= 0xFFEF) {
          const appLen = primaryResized.readUInt16BE(4);
          insertPos += 2 + appLen;
        }

        const primaryWithMpf = Buffer.concat([
          primaryResized.subarray(0, insertPos),
          mpfSeg,
          primaryResized.subarray(insertPos)
        ]);

        finalHdrJpgBuf = Buffer.concat([primaryWithMpf, secondaryResized]);
      }

      // Save HDR JPEG
      const hdrFilename = `${baseName}-${w}w-hdr.jpg`;
      fs.writeFileSync(path.join(cacheDir, hdrFilename), finalHdrJpgBuf);

      // 4. Resized SDR AVIF
      const avifFilename = `${baseName}-${w}w.avif`;
      const avifBuf = await sharp(primaryBuf)
        .resize(w)
        .avif({ quality: 75 })
        .toBuffer();
      fs.writeFileSync(path.join(cacheDir, avifFilename), avifBuf);

      // 5. Resized SDR WebP
      const webpFilename = `${baseName}-${w}w.webp`;
      const webpBuf = await sharp(primaryBuf)
        .resize(w)
        .webp({ quality: 80 })
        .toBuffer();
      fs.writeFileSync(path.join(cacheDir, webpFilename), webpBuf);
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
    results.hdrJpgSources.push(`${webDistPath}/${baseName}-${w}w-hdr.jpg ${w}w`);
    results.avifSources.push(`${webDistPath}/${baseName}-${w}w.avif ${w}w`);
    results.webpSources.push(`${webDistPath}/${baseName}-${w}w.webp ${w}w`);
  }

  const defaultWidth = targetWidths[Math.floor(targetWidths.length / 2)] || targetWidths[0];
  results.fallbackUrl = `${webDistPath}/${baseName}-${defaultWidth}w-hdr.jpg`;

  return results;
}
