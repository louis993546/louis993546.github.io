import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execFileAsync = promisify(execFile);

const HEIC_EXTENSIONS = new Set(['.heic', '.heif']);
const SWIFT_SOURCE_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), 'heic-converter.swift');

let binaryPromise = null;

export function isHeicExtension(ext) {
  return HEIC_EXTENSIONS.has(ext.toLowerCase());
}

async function ensureConverterBinary() {
  if (binaryPromise) {
    return binaryPromise;
  }

  binaryPromise = (async () => {
    const sourceHash = crypto
      .createHash('sha256')
      .update(fs.readFileSync(SWIFT_SOURCE_PATH))
      .digest('hex')
      .slice(0, 12);

    const binaryPath = path.join(
      os.tmpdir(),
      `eleventy-heic-convert-${process.arch}-${sourceHash}`
    );

    if (fs.existsSync(binaryPath)) {
      return binaryPath;
    }

    const tmpBinaryPath = `${binaryPath}.${process.pid}.${crypto.randomBytes(4).toString('hex')}`;
    try {
      await execFileAsync('swiftc', ['-O', SWIFT_SOURCE_PATH, '-o', tmpBinaryPath]);
      try {
        fs.renameSync(tmpBinaryPath, binaryPath);
      } catch {
        if (!fs.existsSync(binaryPath)) {
          throw new Error(`Failed to move compiled HEIC converter binary to ${binaryPath}`);
        }
        fs.rmSync(tmpBinaryPath, { force: true });
      }
      return binaryPath;
    } catch (err) {
      fs.rmSync(tmpBinaryPath, { force: true });
      binaryPromise = null;
      throw new Error(`Failed to compile HEIC converter (${SWIFT_SOURCE_PATH}): ${err.stderr || err.message}`);
    }
  })();

  return binaryPromise;
}

export async function convertHeic(inputPath, { forceSdr = false } = {}) {
  if (process.platform !== 'darwin') {
    throw new Error(
      `Uncached HEIC file (${path.relative(process.cwd(), inputPath)}) requires macOS CoreImage for decoding. Run the build on macOS or populate .image-cache first.`
    );
  }

  const binaryPath = await ensureConverterBinary();
  const tmpOutPath = path.join(
    os.tmpdir(),
    `eleventy-heic-out-${process.pid}-${crypto.randomBytes(6).toString('hex')}.bin`
  );

  const args = [inputPath, tmpOutPath];
  if (forceSdr) {
    args.push('--sdr');
  }

  try {
    const { stdout } = await execFileAsync(binaryPath, args, { maxBuffer: 1024 * 1024 });
    const info = JSON.parse(stdout.trim());
    const buffer = fs.readFileSync(tmpOutPath);

    return {
      buffer,
      isHdr: Boolean(info.isHdr),
      width: info.width,
      height: info.height,
      headroom: info.headroom
    };
  } catch (err) {
    throw new Error(`CoreImage HEIC conversion failed for ${inputPath}: ${err.stderr || err.message}`);
  } finally {
    fs.rmSync(tmpOutPath, { force: true });
  }
}
