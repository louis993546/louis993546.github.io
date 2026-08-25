# Developer Guidelines & Project Architecture

This file provides context and strict rules for future developers and AI coding agents working on this website. Refer to this to preserve formatting, routing, styling, and CI/CD conventions.

---

## 📂 Codebase & Content Directory Structure

### 1. Yearly Post Organization
- Source posts are located in `src/posts/` organized in directories by year:
  ```
  src/posts/
  ├── 2017/
  ├── 2018/
  ...
  └── 2024/
  ```
- **CRITICAL:** Do NOT change this folder hierarchy. This yearly structure keeps the IDE file listing clean and organized.

### 2. Flat permalink Routing
- Even though files are nested in folders like `src/posts/2024/post-name.md`, they compile flat to `/post-name/index.html`.
- This is controlled globally by [posts.json](file:///Users/louis/Developer/website/src/posts/posts.json):
  ```json
  {
    "permalink": "/{{ page.fileSlug }}/"
  }
  ```
- **CRITICAL:** Do NOT change the permalink schema. The flat URL mapping preserves legacy SEO routes and matches the old Ghost site.

---

## 🎨 Stylesheets & esbuild Bundling

We use a modular CSS setup bundled with **esbuild** on-the-fly.

### 1. Modular CSS Split
The source stylesheets under `src/assets/css/` are split into:
- [base.css](file:///Users/louis/Developer/website/src/assets/css/base.css): Typography, resets, standard tag layouts.
- [layout.css](file:///Users/louis/Developer/website/src/assets/css/layout.css): Header, menus, mobile burger, grids.
- [cards.css](file:///Users/louis/Developer/website/src/assets/css/cards.css): Home feed listing templates.
- [ghost-cards.css](file:///Users/louis/Developer/website/src/assets/css/ghost-cards.css): Styling for Koenig editor widgets (bookmarks, callouts, toggles).
- [article.css](file:///Users/louis/Developer/website/src/assets/css/article.css): Individual blog post page details.
- [theme.css](file:///Users/louis/Developer/website/src/assets/css/theme.css): Layout variables and font stacks.
- [custom.css](file:///Users/louis/Developer/website/src/assets/css/custom.css): Custom spacing, contrast fixes, and smooth scrolling overrides.

### 2. Manifest and Bundler Hook
- [screen.css](file:///Users/louis/Developer/website/src/assets/css/screen.css) serves as a manifest loading all parts:
  ```css
  @import "base.css";
  @import "layout.css";
  ...
  ```
- During Eleventy builds, **esbuild** hooks into `"eleventy.before"` inside [eleventy.config.js](file:///Users/louis/Developer/website/eleventy.config.js):
  ```javascript
  eleventyConfig.on("eleventy.before", async () => {
    await esbuild.build({
      entryPoints: ["src/assets/css/screen.css"],
      outfile: "_site/assets/css/screen.css",
      minify: true,
      bundle: true,
    });
  });
  ```
- **Rule:** Do NOT add `src/assets/css` to `eleventyConfig.addPassthroughCopy()`. Let `esbuild` output the final minified bundle to `_site/assets/css/screen.css`.
- **Rule:** Make sure to keep `bundle: true` active so that `@import` references are inlined.

---

## 🖼️ Asset Resolution & Image Plugin Architecture

### 1. Asset Storage Policies
- **Local Storage:** All media assets must be stored locally under `src/assets/images/YYYY/` matching the post organization (e.g. no hotlinking to external hosts; legacy ghost imports reside in `src/assets/images/downloaded_images/`).
- **Profile Avatar:** The homepage author photo is located at `/assets/images/profile.jpg` (optimized at 800px width).
- **Responsive Embeds:** Video `iframe` structures must be fully responsive. Applied globally in base styles using:
  ```css
  iframe {
    width: 100%;
    aspect-ratio: 16/9;
    height: auto;
  }
  ```

### 2. Custom Image Optimization Plugin
We use a custom, modular image processing plugin located under `src/plugins/` and `src/utils/` rather than relying on black-box plugins.

- **Plugin Entry ([image-plugin.js](file:///D:/repositories/website/src/plugins/image-plugin.js)):** Registered via `eleventyConfig.addPlugin(imagePlugin)`. Scans generated HTML pages for `<img>` tags and upgrades them to responsive `<picture>` elements.
- **SDR Image Processor ([sdr-image-processor.js](file:///D:/repositories/website/src/utils/sdr-image-processor.js)):**
  - Automatically generates responsive widths (`600w`, `900w`, `1200w`, `1600w`) for standard images.
  - Generates multi-format sources: **AVIF** (`image/avif`), **WebP** (`image/webp`), and optimized **JPEG/PNG** fallbacks.
  - Caches processed variants under `.cache/sdr-pipeline/<hash>/` so `npm run dev` and `npm run build` stay fast.
- **HDR Detection ([hdr-detector.js](file:///D:/repositories/website/src/utils/hdr-detector.js)):**
  - Analyzes JPEG containers for Apple Gain Map MPF headers and ISO 21496-1 metadata.
  - Bypasses standard SDR compressors to prevent stripping Apple `APP10 AROT` and secondary Gain Map byte streams.

---

## ⚙️ CI/CD & Deployments

- Deployments are managed via GitHub Actions:
  - `.github/workflows/ci.yml`: Validates builds on all incoming Pull Requests targeting `main`.
  - `.github/workflows/deploy.yml`: Deploys the static site to GitHub Pages on every merge into `main`.
- Direct pushes to `main` are restricted. Code updates must go through PR reviews.
