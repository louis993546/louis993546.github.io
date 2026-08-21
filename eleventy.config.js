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
