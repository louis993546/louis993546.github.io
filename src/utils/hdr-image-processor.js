import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const HDR_CACHE_VERSION = 'v2';
const HDR_WIDTHS = [600, 900, 1200, 1600, 2400];
const HDR_JPEG_QUALITY = 85;

// Serialize sharp.keepGainMap() pipelines: libvips/libultrahdr corrupts JPEG
// gain-map streams when multiple keepGainMap() operations run concurrently.
let hdrEncodeQueue = Promise.resolve();

function encodeHdrVariant(fileBuf, width) {
  const run = () =>
    sharp(fileBuf)
      .rotate()
      .keepIccProfile()
      .keepGainMap()
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality: HDR_JPEG_QUALITY })
      .toBuffer();

  const result = hdrEncodeQueue.then(run, run);
  hdrEncodeQueue = result.catch(() => {});
  return result;
}

function buildHdrResult(inputPath, hash, targetWidths, width, height, mode, outputBaseDir) {
  const ext = path.extname(inputPath);
  const baseName = path.basename(inputPath, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const cacheDir = path.join('.image-cache', 'hdr-pipeline', HDR_CACHE_VERSION, hash);
  const targetDistDir = path.join(outputBaseDir, hash);

  fs.mkdirSync(targetDistDir, { recursive: true });
  for (const w of targetWidths) {
    const outName = `${baseName}-${w}w-hdr.jpg`;
    const srcFile = path.join(cacheDir, outName);
    const dstFile = path.join(targetDistDir, outName);
    if (!fs.existsSync(dstFile)) {
      fs.copyFileSync(srcFile, dstFile);
    }
  }

  const webDistPath = `/assets/images/optimized/${hash}`;
  const srcset = targetWidths.map((w) => `${webDistPath}/${baseName}-${w}w-hdr.jpg ${w}w`);
  const defaultWidth = targetWidths.find((w) => w >= 1200) ?? targetWidths[targetWidths.length - 1];
  const fallbackUrl = `${webDistPath}/${baseName}-${defaultWidth}w-hdr.jpg`;

  return {
    isHdr: true,
    optimized: true,
    mode,
    hash,
    width,
    height,
    srcset,
    fallbackUrl
  };
}

export function tryServeCachedHdr(
  inputPath,
  hash,
  outputBaseDir = '_site/assets/images/optimized'
) {
  const cacheDir = path.join('.image-cache', 'hdr-pipeline', HDR_CACHE_VERSION, hash);
  const manifestPath = path.join(cacheDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return null;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const { widths, width, height } = manifest;
    if (!Array.isArray(widths) || widths.length === 0 || !width || !height) {
      return null;
    }

    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const allExist = widths.every((w) => fs.existsSync(path.join(cacheDir, `${baseName}-${w}w-hdr.jpg`)));
    if (!allExist) {
      return null;
    }

    return buildHdrResult(inputPath, hash, widths, width, height, 'cached', outputBaseDir);
  } catch {
    return null;
  }
}

export async function processHdrImage(
  fileBuf,
  inputPath,
  hdrInfo,
  outputBaseDir = '_site/assets/images/optimized',
  { cacheHash } = {}
) {
  if (!hdrInfo.width || !hdrInfo.height || !hdrInfo.hasNativeGainMap) {
    return {
      isHdr: true,
      optimized: false,
      width: hdrInfo.width,
      height: hdrInfo.height
    };
  }

  const ext = path.extname(inputPath);
  const hash = cacheHash ?? crypto.createHash('sha256').update(fileBuf).digest('hex').slice(0, 12);
  const baseName = path.basename(inputPath, ext).replace(/[^a-zA-Z0-9_-]/g, '_');

  let targetWidths = HDR_WIDTHS.filter((w) => w <= hdrInfo.width);
  if (targetWidths.length === 0) {
    targetWidths = [hdrInfo.width];
  } else if (hdrInfo.width < HDR_WIDTHS[HDR_WIDTHS.length - 1] && !targetWidths.includes(hdrInfo.width)) {
    // Include native width if it's between the largest selected breakpoint and the max breakpoint
    if (hdrInfo.width - targetWidths[targetWidths.length - 1] >= 200) {
      targetWidths.push(hdrInfo.width);
    }
  }

  const cacheDir = path.join('.image-cache', 'hdr-pipeline', HDR_CACHE_VERSION, hash);
  const manifestPath = path.join(cacheDir, 'manifest.json');

  let mode = 'cached';

  if (!fs.existsSync(manifestPath)) {
    fs.mkdirSync(cacheDir, { recursive: true });

    try {
      for (const w of targetWidths) {
        const outName = `${baseName}-${w}w-hdr.jpg`;
        const buf = await encodeHdrVariant(fileBuf, w);
        fs.writeFileSync(path.join(cacheDir, outName), buf);
      }
      mode = 'keepGainMap';
      fs.writeFileSync(
        manifestPath,
        JSON.stringify({ mode, widths: targetWidths, width: hdrInfo.width, height: hdrInfo.height })
      );
      console.log(
        `   └─ Generated ${targetWidths.length} ISO 21496-1 HDR variants [${targetWidths.join(', ')}] via sharp.${mode}()`
      );
    } catch (err) {
      console.warn(
        `⚠️  [HDR Fallback] Failed to resize ${path.relative(process.cwd(), inputPath)}: ${err.message}. Serving original file.`
      );
      fs.rmSync(cacheDir, { recursive: true, force: true });
      return {
        isHdr: true,
        optimized: false,
        width: hdrInfo.width,
        height: hdrInfo.height
      };
    }
  }

  return buildHdrResult(inputPath, hash, targetWidths, hdrInfo.width, hdrInfo.height, mode, outputBaseDir);
}
