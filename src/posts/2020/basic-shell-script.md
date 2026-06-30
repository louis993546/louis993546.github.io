---
title: "From Android zero to kinda-middle: Basic shell script for Android dev"
date: 2020-01-12
length: "7 min read"
image: "/assets/images/downloaded_images/2021/04/shell.png"
excerpt: "TL;DR: It can do anything*"
tags:
  - android
  - coding
---

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/assets/images/downloaded_images/downloaded_images/From-Android-zero-to-kinda-middle--Basic-shell-script-for-Android-dev/1-wS0i4sDFxELGwQ-_R4Q9Tg.png" class="kg-image" alt loading="lazy"><figcaption>A bunch of random stuff you can do with shell script</figcaption></figure><p>It has been a while since I did my last “From Android zero to kinda-middle” series, and today I’d like to talk about shell script.</p><h2 id="wtf-is-shell-script">WTF is shell script</h2><p>You can think of it as a scripting language + the program that interprets it.</p><h2 id="why-you-should-know-shell-script">Why you should know shell script?</h2><p>All the buttons in Android Studio will ended up executing some shell script in one way or another. For example,</p><p>“Run” 👉 ./gradlew assemble${flavor} + adb install</p><p>Install newer version of Android SDK 👉 sdkmanager "platforms;android${versionCode}"</p><p>Commit 👉 git commit -m "${message}"</p><p>But if all of the task can be done with buttons, why would anyone want to type all the steps out instead? Well, if you have a series of events you want to run repetitively, having a script will often makes it a lot easier to deal with, esp. when comparing to reading documentation and do it step-by-step. And those automated task can also be done by computers more accurately, for example, have a computer that builds and ship the app every time master branch is updated. And that is basically what "Continuous Integration" or "Continuous Delivery" (also known as CI/CD) are.</p><p>But this only explains half of the question. What makes shell script different than, let say JavaScript? Well, it’s all about the history. Shell script is very much tied to Unix, i.e. the foundation of Linux and macOS, and the popularity of the 2 (among developers and servers) makes it pretty much the universal way to tell a computer how to do something. Not only that, being super close to the operating system, it allows a multitude of tools to do whatever they want to do, from transforming video between formats, frame rate, resolutions, and more with ffmpeg, to compiling Java/Kotlin code with javac/kotlinc, to tools that communicate with external sources or devices like curl or adb.</p><h2 id="what-can-shell-script-do">What can shell script do</h2><p>In general</p><ul><li>Travel in the file system (cd) 🚙</li><li>See where you are (pwd) 🗺</li><li>Create folder(s) (mkdir) 📁</li><li>See what files are there (ls) 🗂</li><li>Modify files (vi/nano) 📝</li><li>Open files and programmes (open on macOS) 👀</li><li>Read files (cat/less) 🖨</li><li>Install other softwares (brew) ⬇️</li><li>Version control with Git (git, dah) 📚</li><li>etc.</li></ul><p>Android-specific</p><ul><li>Talk to Android devices (adb and fastboot) 📱</li><li>Update tools to build Android app (sdkmanager) 📲</li><li>Contribute to AOSP (repo) 💪</li><li>Use dependencies (gradle) 😯</li><li>Build the app (still gradle) 😮</li><li>Test the app (also gradle) 😲</li><li>Install a specific version of gradle (yes the answer is gradle, and then you can use gradlew) 🤯</li><li>etc.</li></ul><h2 id="how-to-run-shell-script">How to run shell script</h2><blockquote>If you are on Windows, I’m sorry but 50% of this article is not for you. While the concept is the same, they are so fundamentally different, that you should be using something call “Command Line” or “PowerShell”. These are 2 different program + scripting language that runs on Windows, and I have little to no knowledge about them. A quick Google will help you a lot more. And if you are brave enough, you can also try out WSL (and WSL2) to run the following steps. Not everything will work.</blockquote><p>Now that Windows users are out of the way, let see some basic commands on Linux or macOS!</p><ol><li>Open “Terminal” on your computer</li><li>Use pwd to see where you are in the file system</li><li>Use cd ${folder name} to move into a folder</li><li>Use cd .. to move to out of a folder</li><li>If you are not sure where you are, just type cd will take you back home.</li><li>Use mkdir ${folder name} to create a new folder</li><li>Use touch ${file name} to create a new file</li><li>(macOS only) Open a file with it’s default program with open ${file name}</li><li>(macOS only) Open a folder with open .</li><li>. means the folder you are currently in</li><li>man ${command}(e.g. man git) shows a manuel of the command</li></ol><p>And now, let’s try to create a new git repository, and then delete it</p><pre><code># Create a folder
mkdir newProject
​
# Move into that folder
cd newProject
​
# Tell git this is a new repository
git init
​
# Create an empty README
touch README.md
​
# Enter some text into README
echo "# Hello, World!" &gt; README.md
​
# Tell git to stage everything
git add .
​
# Commit with message
git commit -m "Initial commit"
​
# Show commit history
git log
​
## Go back out
cd ..
​
## Delete folder (the -r is needed to remove folder. It stands for recursive)
rm -r newProject</code></pre><p>All the line starts with # are short comments that explains what the command does. And feel free to mix and match all of these, or just randomly roll around and try things out. But be careful, you don't want to mess up your computer.</p><h2 id="practical-shell-script-examples">Practical shell script examples</h2><h3 id="install-httpie-a-pretty-user-friendly-way-to-call-rest-api-form-terminal">Install <a href="https://httpie.org/">httpie</a>, a pretty user-friendly way to call REST API form terminal</h3><p>On <strong>Linux</strong>, there are a lot of “Package Manager”, and in this case we will use Debian/Ubuntu as an example, which uses apt-get, and that is includes when you install the OS.</p><pre><code>sudo apt-get update
# Then type your password for the computer

sudo apt-get install httpie
# Then you will have to accept it

http --version</code></pre><p>And on <strong>macOS</strong>, the most popular package manager is call “<a href="https://brew.sh/">homebrew</a>”, and first, you will need to install it. At the time of writing (Jan 2020), you just need to run</p><pre><code># This is from Jan 2020. Please check the website for the most up-to-date install instruction
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# Install httpie. This will usually take quite a while
brew install httpie

http --version</code></pre><h3 id="run-unit-tests-for-the-entire-project">Run unit tests for the entire project</h3><pre><code># Assuming you are already in the folder of your project
./gradlew test</code></pre><h3 id="verify-code-style-with-pre-commit-hook">Verify code style with pre-commit hook</h3><p><a href="https://github.com/pinterest/ktlint">ktlint</a> is a tool that verifies and fixes kotlin code. And git hook is basically a script that runs in specific time in the git process, in this case, pre-commit will run when you are trying to commit, and if it failes, the commit also fails, which makes it a great place for enforce coding style in a team.</p><pre><code># Install the latest version (0.36.0)
curl -sSLO https://github.com/pinterest/ktlint/releases/download/0.36.0/ktlint &amp;&amp;
  chmod a+x ktlint &amp;&amp;
  sudo mv ktlint /usr/local/bin/
  
# Ask ktlint to install itself as pre-commit git hook
ktlint installGitPreCommitHook

# Imagine you have typed some kotlin code that's not perfectly format

# Commit and this will fail
git commit -m "Bad commit"</code></pre><h3 id="build-publish-app-automatically-with-gradle-and-fastlane">Build &amp; Publish app automatically with Gradle and fastlane</h3><p>You probably already know the existance of Gradle (via build.gradle), and fastlane is a tool that can automate a lot of stuff for Android and iOS developers. Instead of writing all the steps here, please checkout the official documentation on how to <a href="https://docs.fastlane.tools/getting-started/android/setup/">install</a> and <a href="https://docs.fastlane.tools/getting-started/android/release-deployment/">publish to Play Store</a>, and <a href="https://about.gitlab.com/blog/2019/01/28/android-publishing-with-gitlab-and-fastlane/">this article from GitLab</a> on how to compile and run fastlane on Linux.</p><hr><h2 id="closing-words">Closing words</h2><p>I still remember when I start learning/using shell script from about a year ago, and I was like “Ugh really? It’s 2019 and I am going back to using computer like the 70s?”. But after a while, I realised the flexibility of it opens a lot of doors. It did took a while for me to understand some basic shell script syntax, but I promise you at some point you will find some usecases that shell script will make you life as an Android developer a lot easier to deal with! Thank you for reading, and I will see you next time!

</p>