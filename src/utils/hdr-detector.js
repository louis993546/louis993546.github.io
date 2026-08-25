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

// Single unified HDR detection function (works directly on buffer)
export async function detectHdr(fileBuf, filePath = '') {
  const secOffset = findSecondaryJpegOffset(fileBuf);
  const isMpf = fileBuf.toString('binary').includes('MPF\0');

  if (secOffset > 0 && isMpf) {
    const primaryBuf = fileBuf.subarray(0, secOffset);
    const secondaryBuf = fileBuf.subarray(secOffset);
    const secStr = secondaryBuf.toString('utf8');

    const isAppleHdr = secStr.includes('HDRGainMap') || secStr.includes('hdrgainmap');
    const isIsoHdr = secStr.includes('hdrgm:Version') || secStr.includes('iso:ts:21496');

    if (isAppleHdr || isIsoHdr) {
      const primaryMeta = await sharp(primaryBuf).metadata();
      const secMeta = await sharp(secondaryBuf).metadata();

      const info = {
        isHdr: true,
        type: isAppleHdr ? 'Apple HDR Gain Map (MPF)' : 'ISO 21496-1 / Ultra HDR',
        primary: {
          width: primaryMeta.width,
          height: primaryMeta.height,
          sizeBytes: primaryBuf.length,
          sizeMb: (primaryBuf.length / (1024 * 1024)).toFixed(2)
        },
        secondary: {
          width: secMeta.width,
          height: secMeta.height,
          sizeBytes: secondaryBuf.length,
          sizeKb: (secondaryBuf.length / 1024).toFixed(1),
          offset: secOffset
        }
      };

      if (filePath) {
        console.log(`\n📷 [HDR Detected] ${path.relative(process.cwd(), filePath).replace(/\\/g, '/')}`);
        console.log(`   ├─ Type: ${info.type}`);
        console.log(`   ├─ Primary Image: ${info.primary.width}x${info.primary.height} (${info.primary.sizeMb} MB)`);
        console.log(`   └─ Gain Map Layer: ${info.secondary.width}x${info.secondary.height} (${info.secondary.sizeKb} KB at byte offset ${info.secondary.offset})`);
      }

      return info;
    }
  }

  return { isHdr: false };
}
