import path from 'path';
import fs from 'fs';
import { processImage, clearImageMemo } from '../utils/sdr-image-processor.js';

const DEFAULT_SIZES = '(max-width: 800px) 100vw, 1200px';

function getAttr(attrs, name) {
  const match = attrs.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'));
  return match ? match[1] : null;
}

function buildOptionalAttrs(attrs) {
  const classText = getAttr(attrs, 'class');
  const fetchpriority = getAttr(attrs, 'fetchpriority');
  const style = getAttr(attrs, 'style');

  return (
    (classText ? ` class="${classText}"` : '') +
    (fetchpriority ? ` fetchpriority="${fetchpriority}"` : '') +
    (style ? ` style="${style}"` : '')
  );
}

export function imagePlugin(eleventyConfig) {
  eleventyConfig.on('eleventy.before', () => {
    clearImageMemo();
  });

  eleventyConfig.addTransform('imageOptimizationTransform', async function (content, outputPath) {
    if (!outputPath || !outputPath.endsWith('.html')) {
      return content;
    }

    const imgRegex = /<img\s+([^>]*?\bsrc=["'](\/assets\/images\/[^"']+)["'][^>]*?)>/gi;
    const matches = [];
    let match;

    while ((match = imgRegex.exec(content)) !== null) {
      matches.push({
        index: match.index,
        fullTag: match[0],
        attrs: match[1],
        rawSrc: match[2]
      });
    }

    if (matches.length === 0) {
      return content;
    }

    const replacements = await Promise.all(
      matches.map(async (item) => {
        const { attrs, rawSrc } = item;

        // Opt-out hook (e.g. for side-by-side comparison on test pages)
        if (/\bdata-original\b/i.test(attrs)) {
          return null;
        }

        const srcPath = decodeURIComponent(rawSrc).replace(/\\/g, '/');
        const localPath = path.join(process.cwd(), 'src', srcPath);

        if (!fs.existsSync(localPath)) {
          return null;
        }

        const imgData = await processImage(localPath);
        if (!imgData) {
          return null;
        }

        const altText = getAttr(attrs, 'alt') ?? '';
        const loadingAttr = getAttr(attrs, 'loading') ?? 'lazy';
        const sizesAttr = getAttr(attrs, 'sizes') ?? DEFAULT_SIZES;
        const optionalAttrs = buildOptionalAttrs(attrs);

        // HDR Gain-Map JPEG: serve responsive gain-map JPEGs directly (no SDR AVIF/WebP <source> that would strip HDR)
        if (imgData.isHdr) {
          if (imgData.optimized) {
            return `<img src="${imgData.fallbackUrl}" srcset="${imgData.srcset.join(', ')}" sizes="${sizesAttr}" alt="${altText}"${optionalAttrs} loading="${loadingAttr}" decoding="async" width="${imgData.width}" height="${imgData.height}">`;
          }
          // Fallback if an exotic HDR file couldn't be resized: preserve original src but still add dimensions & async decoding
          const dimAttrs =
            imgData.width && imgData.height ? ` width="${imgData.width}" height="${imgData.height}"` : '';
          return `<img src="${rawSrc}" alt="${altText}"${optionalAttrs} loading="${loadingAttr}" decoding="async"${dimAttrs}>`;
        }

        // Standard SDR image: responsive <picture> with AVIF, WebP, and JPEG/PNG fallback
        return (
          `<picture>` +
          `\n    <source type="image/avif" srcset="${imgData.avifSrcset.join(', ')}" sizes="${sizesAttr}">` +
          `\n    <source type="image/webp" srcset="${imgData.webpSrcset.join(', ')}" sizes="${sizesAttr}">` +
          `\n    <img src="${imgData.fallbackUrl}" srcset="${imgData.fallbackSrcset.join(', ')}" sizes="${sizesAttr}" alt="${altText}"${optionalAttrs} loading="${loadingAttr}" decoding="async" width="${imgData.width}" height="${imgData.height}">` +
          `\n  </picture>`
        );
      })
    );

    // Apply replacements from end to start so indices stay valid even when identical <img> tags appear multiple times
    let result = content;
    for (let i = matches.length - 1; i >= 0; i--) {
      const replacement = replacements[i];
      if (replacement !== null) {
        const { index, fullTag } = matches[i];
        result = result.slice(0, index) + replacement + result.slice(index + fullTag.length);
      }
    }

    return result;
  });
}
