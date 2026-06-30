# Louis Tsai's Personal Website

A super-fast, fully responsive, and minimalist static website powered by **11ty (Eleventy)**. The visual design is ported and adapted from the official [Ghost Solo](https://github.com/TryGhost/Solo) theme.

## 🚀 Features

- **100% Static HTML:** Zero external client-side JavaScript loaders, resulting in near-instant page load times.
- **System Fonts:** Redefined to use optimized system-native font stacks (no font file network latency, zero layout shifting).
- **Self-Hosted Assets:** Automatically downloads and resolves all blog content images locally, ensuring the site is fully self-sufficient.
- **Client-Friendly Pagination:** Clean 10-posts-per-page feeds with native 11ty pagination templates.
- **Modern a11y:** Accessible mobile menu burger toggles using `aria-expanded` attributes.
- **Automated Workflows:** GitHub Actions pipeline configured for Pull Request verification and automatic branch deployment to GitHub Pages.

## 🛠️ Local Development

### 1. Install Dependencies

Ensure you have Node.js installed, then run:

```bash
npm install
```

### 2. Run the Development Server

To run the hot-reloading development server locally:

```bash
npm run dev
```

The site will be available at `http://localhost:8080`.

### 3. Build for Production

To build the optimized static assets into the `_site/` distribution folder:

```bash
npm run build
```

## 📦 Deployment

Deployments are managed automatically via GitHub Actions:
- **Merges to `main`:** Automatically compiles and deploys the static output to GitHub Pages.
- **Pull Requests targeting `main`:** Runs CI build verification checks to prevent broken configurations.

## 📄 License

This repository is licensed under the [MIT License](LICENSE).
Design patterns and layout templates are adapted from [TryGhost/Solo](https://github.com/TryGhost/Solo) (Copyright (c) 2013-2026 Ghost Foundation).

## 🌐 Custom Domain Setup (via Cloudflare DNS)

To route your custom domain (`louis993546.com`) to this GitHub Pages site using Cloudflare for caching, SSL, and security:

### Step 1: Configure Cloudflare DNS
1. Sign up for a free account at [Cloudflare](https://dash.cloudflare.com/).
2. Add your domain `louis993546.com` and point your domain registrar's Nameservers (NS) to the ones provided by Cloudflare.
3. In the Cloudflare DNS dashboard, add the following records:
   * **CNAME** | `@` (root) | `louis993546.github.io` | 🟠 Proxied (enabled)
   * **CNAME** | `www` | `louis993546.github.io` | 🟠 Proxied (enabled)

### Step 2: Configure GitHub Pages Custom Domain
1. In your GitHub repository, go to **Settings** -> **Pages** (under Code and automation).
2. Under **Custom domain**, enter your custom domain: `louis993546.com`.
3. Click **Save**. GitHub will automatically verify your DNS setup and issue an SSL certificate.
4. Check **Enforce HTTPS** once the SSL certificate is generated (usually takes a few minutes).

