import esbuild from "esbuild";
import pluginRss from "@11ty/eleventy-plugin-rss";
import path from "path";
import fs from "fs";
import { processHdrImage } from "./src/utils/hdr-image-processor.js";

export default function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);

  // Pass-through copies
  eleventyConfig.addPassthroughCopy("src/assets/built");
  eleventyConfig.addPassthroughCopy("src/assets/images");

  // Minify CSS on build using esbuild
  eleventyConfig.on("eleventy.before", async () => {
    await esbuild.build({
      entryPoints: ["src/assets/css/screen.css"],
      outfile: "_site/assets/css/screen.css",
      minify: true,
      bundle: true,
    });
  });

  // Watch targets for development reload
  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/built/");

  // HTML Transform to process HDR images and convert <img> to <picture>
  eleventyConfig.addTransform("hdrImageTransform", async function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      const imgRegex = /<img\s+([^>]*?\bsrc=["'](\/assets\/images\/[^"']+)["'][^>]*?)>/gi;
      let match;
      const replacements = [];

      while ((match = imgRegex.exec(content)) !== null) {
        const fullTag = match[0];
        const attrs = match[1];
        let srcPath = match[2];

        // Decode URL encoding (e.g. %20 -> space, slashes)
        srcPath = decodeURIComponent(srcPath).replace(/\\/g, '/');
        const localPath = path.join(process.cwd(), 'src', srcPath);

        if (fs.existsSync(localPath)) {
          const imgData = await processHdrImage(localPath);
          if (imgData) {
            const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
            const altText = altMatch ? altMatch[1] : "";

            const classMatch = attrs.match(/class=["']([^"']*)["']/i);
            const classText = classMatch ? classMatch[1] : "";

            const pictureHtml = `<picture>` +
              `\n    <source type="image/jpeg" srcset="${imgData.jpgSources.join(', ')}" sizes="(max-width: 800px) 100vw, 1200px">` +
              `\n    <img src="${imgData.fallbackUrl}" alt="${altText}"${classText ? ` class="${classText}"` : ''} loading="lazy" decoding="async">` +
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

  // Date Filters
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC"
    });
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return new Date(dateObj).toISOString().split('T')[0];
  });

  eleventyConfig.addFilter("readingTime", (content) => {
    if (!content) return "1 min read";
    const clean = content.replace(/<\/?[^>]+(>|$)/g, " ");
    const words = clean.trim().split(/\s+/).filter(w => w.length > 0).length;
    const wordsPerMinute = 200;
    const minutes = Math.ceil(words / wordsPerMinute) || 1;
    return `${minutes} min read`;
  });

  // Shortcode for dynamic year
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data"
    }
  };
}
