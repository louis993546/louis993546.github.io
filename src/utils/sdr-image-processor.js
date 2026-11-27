import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { detectHdr } from './hdr-detector.js';
import { processHdrImage } from './hdr-image-processor.js';

const RASTER_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff']);
const SDR_WIDTHS = [600, 900, 1200, 1600];

// Memoize in-flight and completed work per build so repeated images across pages are only processed once
const buildMemo = new Map();

export function clearImageMemo() {
  buildMemo.clear();
}

export async function processImage(inputPath, outputBaseDir = '_site/assets/images/optimized') {
  const memoKey = `${inputPath}::${outputBaseDir}`;
  if (buildMemo.has(memoKey)) {
    return buildMemo.get(memoKey);
  }

  const promise = processImageInternal(inputPath, outputBaseDir);
  buildMemo.set(memoKey, promise);
  return promise;
}

// Backwards-compatible alias
export const processSdrImage = processImage;

async function processImageInternal(inputPath, outputBaseDir) {
  if (!fs.existsSync(inputPath)) {
    return null;
  }

  const ext = path.extname(inputPath).toLowerCase();
  if (!RASTER_EXTENSIONS.has(ext)) {
    return null;
  }

  const fileBuf = fs.readFileSync(inputPath);
  const meta = await sharp(fileBuf).metadata();

  const hdrInfo = await detectHdr(fileBuf, inputPath, meta);
  if (hdrInfo.isHdr) {
    return processHdrImage(fileBuf, inputPath, hdrInfo, outputBaseDir);
  }

  const width = hdrInfo.width;
  const height = hdrInfo.height;
  if (!width || !height) {
    return null;
  }

  const hash = crypto.createHash('sha256').update(fileBuf).digest('hex').slice(0, 12);
  const baseName = path.basename(inputPath, ext).replace(/[^a-zA-Z0-9_-]/g, '_');

  const cacheDir = path.join('.image-cache', 'sdr-pipeline', hash);
  const targetDistDir = path.join(outputBaseDir, hash);

  let targetWidths = SDR_WIDTHS.filter((w) => w <= width);
  if (targetWidths.length === 0) {
    targetWidths = [width];
  }

  const isPng = ext === '.png';
  const fallbackExt = isPng ? 'png' : 'jpg';

  const results = {
    isHdr: false,
    optimized: true,
    hash,
    width,
    height,
    avifSrcset: [],
    webpSrcset: [],
    fallbackSrcset: [],
    fallbackUrl: ''
  };

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });

    try {
      for (const w of targetWidths) {
        const resized = sharp(fileBuf).rotate().keepIccProfile().resize(w);

        const avifName = `${baseName}-${w}w.avif`;
        const webpName = `${baseName}-${w}w.webp`;
        const fallbackName = `${baseName}-${w}w.${fallbackExt}`;

        const [avifBuf, webpBuf, fallbackBuf] = await Promise.all([
          resized.clone().avif({ quality: 75, effort: 2 }).toBuffer(),
          resized.clone().webp({ quality: 80, effort: 4 }).toBuffer(),
          isPng
            ? resized.clone().png({ compressionLevel: 8 }).toBuffer()
            : resized.clone().jpeg({ quality: 85, mozjpeg: true }).toBuffer()
        ]);

        fs.writeFileSync(path.join(cacheDir, avifName), avifBuf);
        fs.writeFileSync(path.join(cacheDir, webpName), webpBuf);
        fs.writeFileSync(path.join(cacheDir, fallbackName), fallbackBuf);
      }
    } catch (err) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      throw err;
    }
  }

  fs.mkdirSync(targetDistDir, { recursive: true });

  const files = fs.readdirSync(cacheDir);
  for (const f of files) {
    const dstFile = path.join(targetDistDir, f);
    if (!fs.existsSync(dstFile)) {
      fs.copyFileSync(path.join(cacheDir, f), dstFile);
    }
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
