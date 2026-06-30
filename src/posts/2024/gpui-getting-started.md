---
title: "GPUI: Getting Started"
date: 2024-04-13
length: "1 min read"
image: "/assets/images/downloaded_images/2024/04/Screenshot-2024-04-13-at-10.11.44.png"
tags:
  - coding
---

<blockquote>A series of me learning how to write Rust &amp; build GUI application using <a href="https://www.gpui.rs" rel="noreferrer">GPUI</a></blockquote><h2 id="prerequisite">Prerequisite</h2><ol><li>You are on macOS, cause GPUI only works on macOS at the moment.</li><li><a href="https://www.rust-lang.org/tools/install" rel="noreferrer">You have Rust installed</a></li></ol><h2 id="step-1-create-new-project">Step 1: Create new project</h2><p>For those not familiar, <code>cargo</code> is the package manager for Rust, and it also has a simple <code>cargo init</code> function that initialise a full folder for you.</p><p>Once it's created, open that folder with your choice of IDE/Text Editor.</p><h2 id="step-2-add-gpui-as-dependency">Step 2: Add GPUI as dependency</h2><p>And in Rust, you add dependencies in the <code>Cargo.toml</code> file. As stated in their <a href="https://github.com/zed-industries/zed/tree/main/crates/gpui#getting-started" rel="noreferrer">README</a>, as it's not stable yet, there is no versioning (and promise of and forward/backward compatibility that implied from versioning), so you need to tell cargo to just get the whole thing (the nomenclature is a "crate")  using git.</p><pre><code class="language-toml"># [package] and everything else above

[dependencies]
gpui = { git = "https://github.com/zed-industries/zed" }</code></pre><p>Once you are done, you can run <code>cargo install</code> to be sure package manager fetch everything it needs.</p><h2 id="step-3-run-some-example">Step 3: Run some example</h2><p>Again <a href="in the repository, they have some examples you can get started with" rel="noreferrer">in the repository, they have some examples you can get started with</a>. Once you copied something, just run <code>cargo run</code>. </p>