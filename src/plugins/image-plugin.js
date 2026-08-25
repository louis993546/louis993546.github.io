import path from 'path';
import fs from 'fs';
import { processSdrImage } from '../utils/sdr-image-processor.js';

export function imagePlugin(eleventyConfig) {
  eleventyConfig.addTransform('imageOptimizationTransform', async function(content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
      const imgRegex = /<img\s+([^>]*?\bsrc=["'](\/assets\/images\/[^"']+)["'][^>]*?)>/gi;
      let match;
      const replacements = [];

      while ((match = imgRegex.exec(content)) !== null) {
        const fullTag = match[0];
        const attrs = match[1];
        let srcPath = match[2];

        srcPath = decodeURIComponent(srcPath).replace(/\\/g, '/');
        const localPath = path.join(process.cwd(), 'src', srcPath);

        if (fs.existsSync(localPath)) {
          const imgData = await processSdrImage(localPath);

          if (imgData && !imgData.isHdr) {
            const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
            const altText = altMatch ? altMatch[1] : '';

            const classMatch = attrs.match(/class=["']([^"']*)["']/i);
            const classText = classMatch ? classMatch[1] : '';

            const pictureHtml = `<picture>` +
              `\n    <source type="image/avif" srcset="${imgData.avifSrcset.join(', ')}" sizes="(max-width: 800px) 100vw, 1200px">` +
              `\n    <source type="image/webp" srcset="${imgData.webpSrcset.join(', ')}" sizes="(max-width: 800px) 100vw, 1200px">` +
              `\n    <img src="${imgData.fallbackUrl}" srcset="${imgData.fallbackSrcset.join(', ')}" sizes="(max-width: 800px) 100vw, 1200px" alt="${altText}"${classText ? ` class="${classText}"` : ''} loading="lazy" decoding="async" width="${imgData.width}" height="${imgData.height}">` +
              `\n  </picture>`;

            replacements.push({ fullTag, pictureHtml });
          }
        }
      }

      for (const { fullTag, pictureHtml } of replacements) {
        content = content.replace(fullTag, pictureHtml);
      }
    }
    return content;
  });
}
