import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { detectHdr } from './hdr-detector.js';

export async function processSdrImage(inputPath, outputBaseDir = '_site/assets/images/optimized') {
  if (!fs.existsSync(inputPath)) {
    return null;
  }

  const ext = path.extname(inputPath).toLowerCase();
  // Only process raster formats (jpeg, jpg, png, webp, tiff)
  if (!['.jpg', '.jpeg', '.png', '.webp', '.tiff'].includes(ext)) {
    return null;
  }

  const fileBuf = fs.readFileSync(inputPath);

  // Single unified check: if HDR, return detection info immediately without processing SDR variants
  const hdrInfo = await detectHdr(fileBuf, inputPath);
  if (hdrInfo.isHdr) {
    return { isHdr: true, ...hdrInfo, path: inputPath };
  }

  const hash = crypto.createHash('md5').update(fileBuf).digest('hex').slice(0, 10);
  const baseName = path.basename(inputPath, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  
  const cacheDir = path.join('.cache', 'sdr-pipeline', hash);
  const targetDistDir = path.join(outputBaseDir, hash);
  
  const meta = await sharp(fileBuf).metadata();
  if (!meta.width || !meta.height) {
    return null;
  }

  // Standard responsive breakpoints
  const standardWidths = [600, 900, 1200, 1600];
  let targetWidths = standardWidths.filter(w => w <= meta.width);
  if (targetWidths.length === 0) {
    targetWidths = [meta.width];
  }

  const isPng = ext === '.png';
  const fallbackExt = isPng ? 'png' : 'jpg';

  const results = {
    isHdr: false,
    hash,
    width: meta.width,
    height: meta.height,
    avifSrcset: [],
    webpSrcset: [],
    fallbackSrcset: [],
    fallbackUrl: ''
  };

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });

    for (const w of targetWidths) {
      // 1. AVIF format
      const avifName = `${baseName}-${w}w.avif`;
      const avifBuf = await sharp(fileBuf)
        .resize(w)
        .avif({ quality: 75, effort: 4 })
        .toBuffer();
      fs.writeFileSync(path.join(cacheDir, avifName), avifBuf);

      // 2. WebP format
      const webpName = `${baseName}-${w}w.webp`;
      const webpBuf = await sharp(fileBuf)
        .resize(w)
        .webp({ quality: 80, effort: 4 })
        .toBuffer();
      fs.writeFileSync(path.join(cacheDir, webpName), webpBuf);

      // 3. Fallback format (JPEG / PNG)
      const fallbackName = `${baseName}-${w}w.${fallbackExt}`;
      const imgInstance = sharp(fileBuf).resize(w);
      const fallbackBuf = isPng
        ? await imgInstance.png({ compressionLevel: 8 }).toBuffer()
        : await imgInstance.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
      fs.writeFileSync(path.join(cacheDir, fallbackName), fallbackBuf);
    }
  }

  // Ensure output directory exists in _site
  fs.mkdirSync(targetDistDir, { recursive: true });
  
  // Copy cached files to dist directory
  const files = fs.readdirSync(cacheDir);
  for (const f of files) {
    fs.copyFileSync(path.join(cacheDir, f), path.join(targetDistDir, f));
  }

  const webDistPath = `/assets/images/optimized/${hash}`;

  for (const w of targetWidths) {
    results.avifSrcset.push(`${webDistPath}/${baseName}-${w}w.avif ${w}w`);
    results.webpSrcset.push(`${webDistPath}/${baseName}-${w}w.webp ${w}w`);
    results.fallbackSrcset.push(`${webDistPath}/${baseName}-${w}w.${fallbackExt} ${w}w`);
  }

  const defaultWidth = targetWidths[Math.floor(targetWidths.length / 2)] || targetWidths[0];
  results.fallbackUrl = `${webDistPath}/${baseName}-${defaultWidth}w.${fallbackExt}`;

  return results;
}
