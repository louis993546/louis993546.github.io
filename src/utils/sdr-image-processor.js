import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { detectHdr } from './hdr-detector.js';
import { processHdrImage, tryServeCachedHdr } from './hdr-image-processor.js';
import { isHeicExtension, convertHeic } from './heic-processor.js';

const RASTER_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.heic', '.heif']);
const SDR_WIDTHS = [600, 900, 1200, 1600];
const HEIC_META_CACHE_DIR = path.join('.image-cache', 'heic-meta', 'v1');

// Memoize in-flight and completed work per build so repeated images across pages are only processed once
const buildMemo = new Map();

export function clearImageMemo() {
  buildMemo.clear();
}

export async function processImage(
  inputPath,
  outputBaseDir = '_site/assets/images/optimized',
  { forceSdr = false } = {}
) {
  const memoKey = `${inputPath}::${outputBaseDir}::${forceSdr ? 'sdr' : 'auto'}`;
  if (buildMemo.has(memoKey)) {
    return buildMemo.get(memoKey);
  }

  const promise = processImageInternal(inputPath, outputBaseDir, { forceSdr });
  buildMemo.set(memoKey, promise);
  return promise;
}

// Backwards-compatible alias
export const processSdrImage = processImage;

async function processImageInternal(inputPath, outputBaseDir, { forceSdr = false } = {}) {
  if (!fs.existsSync(inputPath)) {
    return null;
  }

  const ext = path.extname(inputPath).toLowerCase();
  if (!RASTER_EXTENSIONS.has(ext)) {
    return null;
  }

  const fileBuf = fs.readFileSync(inputPath);
  const hash = crypto.createHash('sha256').update(fileBuf).digest('hex').slice(0, 12);
  const baseName = path.basename(inputPath, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const cacheDir = path.join('.image-cache', 'sdr-pipeline', hash);
  const targetDistDir = path.join(outputBaseDir, hash);

  const meta = await sharp(fileBuf).metadata();
  let width = meta.autoOrient?.width ?? meta.width;
  let height = meta.autoOrient?.height ?? meta.height;
  let sourceBuf = fileBuf;

  if (isHeicExtension(ext)) {
    const heicMetaPath = path.join(HEIC_META_CACHE_DIR, `${hash}.json`);

    if (!forceSdr) {
      // 1. Fast path: HDR variants already cached under original HEIC hash
      const cachedHdr = tryServeCachedHdr(inputPath, hash, outputBaseDir);
      if (cachedHdr) {
        return cachedHdr;
      }

      // 2. Fast path: previously probed as non-HDR HEIC and SDR cache is populated
      let knownNonHdr = false;
      if (fs.existsSync(heicMetaPath) && fs.existsSync(cacheDir)) {
        try {
          const cachedMeta = JSON.parse(fs.readFileSync(heicMetaPath, 'utf8'));
          if (cachedMeta.isHdr === false) {
            knownNonHdr = true;
            width = cachedMeta.width ?? width;
            height = cachedMeta.height ?? height;
          }
        } catch {
          // Re-probe via CoreImage if metadata cache is unreadable
        }
      }

      // 3. Cache miss: decode via macOS CoreImage (preserves HDR gain map or outputs lossless SDR TIFF)
      if (!knownNonHdr) {
        const converted = await convertHeic(inputPath, { forceSdr: false });
        width = converted.width || width;
        height = converted.height || height;

        fs.mkdirSync(HEIC_META_CACHE_DIR, { recursive: true });
        fs.writeFileSync(
          heicMetaPath,
          JSON.stringify({ isHdr: converted.isHdr, width, height, headroom: converted.headroom })
        );

        if (converted.isHdr) {
          const hdrInfo = await detectHdr(converted.buffer, inputPath);
          return processHdrImage(converted.buffer, inputPath, hdrInfo, outputBaseDir, {
            cacheHash: hash
          });
        }

        sourceBuf = converted.buffer;
      }
    } else if (!fs.existsSync(cacheDir)) {
      // Forced SDR (e.g. data-sdr control) on cache miss: decode lossless SDR TIFF via CoreImage
      const converted = await convertHeic(inputPath, { forceSdr: true });
      width = converted.width || width;
      height = converted.height || height;
      sourceBuf = converted.buffer;
    }
  } else if (!forceSdr) {
    const hdrInfo = await detectHdr(fileBuf, inputPath, meta);
    if (hdrInfo.isHdr) {
      return processHdrImage(fileBuf, inputPath, hdrInfo, outputBaseDir, { cacheHash: hash });
    }
    width = hdrInfo.width;
    height = hdrInfo.height;
  }

  if (!width || !height) {
    return null;
  }

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
        const resized = sharp(sourceBuf).rotate().keepIccProfile().resize(w);

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
