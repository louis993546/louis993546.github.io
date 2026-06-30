---
title: "My Preferred GitHub Actions Setup for Android Projects"
date: 2021-07-29
length: "3 min read"
image: "/assets/images/downloaded_images/2021/07/2021-07-29-21.47.14.png"
tags:
  - coding
  - android
  - learning-in-public
---

<blockquote>This is the first post in my <a href="https://www.swyx.io/learn-in-public/">"Learning in Public"</a> series, i.e. it's basically just my note but in blog post form. Things will probably be too specific just for me, but if you happens to have the exact same issue, great! Glad that I helped.</blockquote><h2 id="general-idea">General idea</h2><!--kg-card-begin: markdown--><ul>
<li>An action that runs every time something is pushed to <code>main</code>
<ul>
<li>Lint (if I feel like it)</li>
<li>Build debug</li>
<li>Build release + Publish to Play Store</li>
</ul>
</li>
<li>(If I locked the <code>main</code> branch) An action that runs for every Pull Requests
<ul>
<li>Lint (if I feel like it)</li>
<li>Build debug</li>
</ul>
</li>
</ul>
<!--kg-card-end: markdown--><h2 id="setup">Setup</h2><h3 id="step-1-create-githubworkflowsmainyml">Step 1: Create <code>.github/workflows/main.yml</code></h3><h3 id="step-2-setup-when-its-gonna-run">Step 2: Setup when it's gonna run</h3><pre><code class="language-yaml">name: Main
on:
  push:
    branches: [ main ]
    paths-ignore:
      - "**/README.md"  </code></pre><h3 id="step-3-debug-build">Step 3: Debug build</h3><pre><code class="language-yaml"># Everything in Step 2

jobs:
  debug:
  	runs-on: ubuntu-latest
    steps:
    	- name: Checkout Repo
          uses: actions/checkout@v2
        - name: Setup Java 11
          uses: actions/setup-java@v2
          with:
            distribution: 'adopt'
            java-version: 11
        - name: "Validate Gradle wrapper"
          uses: gradle/wrapper-validation-action@v1
        - name: AssembleDebug
          run: ./gradlew assembleDebug
        - name: Upload Debug APK to GitHub
          uses: actions/upload-artifact@v2
          with:
            name: Debug APK
            path app/build/outputs/apk/debug/app-debug.apk</code></pre><h3 id="step-4-release-build">Step 4: Release build</h3><pre><code class="language-yaml"># Everything in Step 2

jobs:
  # Everything in Step 3
  release-app:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2
      - name: Setup Java 11
        uses: actions/setup-java@v2
        with:
          distribution: 'adopt'
          java-version: 11
      - name: "Validate Gradle wrapper"
        uses: gradle/wrapper-validation-action@v1
      - name: Generate Release AAB
        run: ./gradlew bundleRelease
      - name: Sign Android release
        uses: r0adkll/sign-android-release@v1
        with:
          releaseDirectory: app/build/outputs/bundle/release
          signingKeyBase64: ${{ secrets.SIGNING_KEY }}
          alias: ${{ secrets.ALIAS }}
          keyStorePassword: ${{ secrets.KEY_STORE_PASSWORD }}
          keyPassword: ${{ secrets.KEY_PASSWORD }}
      - name: Upload Release AAB to GitHub
        uses: actions/upload-artifact@v2
        with:
          name: Release AAB
          path: app/build/outputs/bundle/release/app-release.aab
      - name: Upload Release AAB to Play Store
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.SERVICE_ACCOUNT_JSON }}
          packageName: # TODO put your package name here
          releaseFiles: app/build/outputs/bundle/release/app-release.aab
          track: # TODO specify track here</code></pre><h3 id="step-5-createfind-all-the-secrets">Step 5: Create/find all the secrets</h3><h5 id="part-1-generate-release-build">Part 1: Generate Release Build</h5><ol><li>Build AAB in Android Studio (if I haven't done that before)</li><li>Make sure I have all the password, alias, everything</li><li>Follow the <a href="https://github.com/r0adkll/sign-android-release">instructions in <code>r0adkll/sign-android-release</code> README</a></li><li>Go to my GitHub project, Settings, and enter all the secrets</li></ol><h5 id="part-2-upload-to-play-store">Part 2: Upload to Play Store</h5><ol><li>Make sure Play Store listing is ready.</li><li>(To make your life easier, you can use the AAB that you just build to make sure all the release notes and what not are setup properly)</li><li>Google the latest tutorial on how to create a service account in GCP</li><li>Grab the JSON for the service account</li><li>Follow the <a href="https://github.com/r0adkll/upload-google-play">instructions in <code>r0adkll/upload-google-play</code> README</a></li><li>Go to my GitHub project, Settings, and enter all the secrets</li></ol><h3 id="step-6-give-it-a-try">Step 6: Give it a try</h3><p>Just push to <code>main</code> and see if everything is working as expected</p><h3 id="step-7-clone-everything-into-pryml-if-i-feel-like-it">Step 7: Clone everything into <code>PR.yml</code> if I feel like it</h3><p>And delete the release part and you will be fine.</p>