import sharp from 'sharp';
import path from 'path';

// Find secondary JPEG offset using MPF header or SOI scan
export function findSecondaryJpegOffset(buf) {
  const mpfIdx = buf.indexOf(Buffer.from('MPF\0'));
  if (mpfIdx !== -1 && mpfIdx + 80 <= buf.length) {
    const tiffOffset = mpfIdx + 4; // 'MM\0\x2A'
    const entry2Offset = buf.readUInt32BE(mpfIdx + 74);
    const candidateOffset = tiffOffset + entry2Offset;
    if (candidateOffset < buf.length && buf[candidateOffset] === 0xFF && buf[candidateOffset + 1] === 0xD8) {
      return candidateOffset;
    }
  }

  // Fallback: scan for SOI after offset 10000
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

// Unified HDR detection using sharp/libultrahdr metadata with MPF/XMP fallback
export async function detectHdr(fileBuf, filePath = '', existingMeta = null) {
  const meta = existingMeta ?? await sharp(fileBuf).metadata();
  const width = meta.autoOrient?.width ?? meta.width;
  const height = meta.autoOrient?.height ?? meta.height;

  const hasNativeGainMap = Boolean(meta.gainMap?.image);
  const hasIsoMarker = fileBuf.includes('urn:iso:std:iso:ts:21496:-1') || fileBuf.includes('hdrgm:Version');
  const hasAppleMarker = fileBuf.includes('HDRGainMap') || fileBuf.includes('hdrgainmap');

  if (hasNativeGainMap || (meta.format === 'jpeg' && (hasIsoMarker || hasAppleMarker))) {
    let type = 'ISO 21496-1 / Ultra HDR';
    if (hasAppleMarker && !hasIsoMarker) {
      type = 'Apple HDR Gain Map (MPF)';
    }

    const gainMapBytes = meta.gainMap?.image?.length ?? 0;
    const info = {
      isHdr: true,
      hasNativeGainMap,
      type,
      width,
      height,
      primary: {
        width,
        height,
        sizeBytes: fileBuf.length,
        sizeMb: (fileBuf.length / (1024 * 1024)).toFixed(2)
      },
      secondary: {
        sizeBytes: gainMapBytes,
        sizeKb: (gainMapBytes / 1024).toFixed(1)
      }
    };

    if (filePath) {
      console.log(`\n📷 [HDR Detected] ${path.relative(process.cwd(), filePath).replace(/\\/g, '/')}`);
      console.log(`   ├─ Type: ${info.type}`);
      console.log(`   ├─ Dimensions: ${width}x${height} (${info.primary.sizeMb} MB original)`);
      if (gainMapBytes > 0) {
        console.log(`   └─ Embedded Gain Map: ${info.secondary.sizeKb} KB`);
      }
    }

    return info;
  }

  return { isHdr: false, width, height };
}
