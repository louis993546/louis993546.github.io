---
title: Test
author: Louis Tsai
date: 2019-04-30
hero: ./images/hero.jpg
excerpt: With the growing community interest in Gatsby, we hope to create more resources that make it easier for anyone to grasp the power of this incredible tool.
---
# What have I learned from a year of OS + distro hopping

A representation of the circle of life, photo by Thomas Lambert on Unsplash

About a year ago, I bought a ThinkPad T480 to replace my aging MacBook Air 11" from 2014. And since the very beginning, I have spent way too much time hopping from one OS to another, trying to find the best setup for me, instead of actually getting stuff done. 2 weeks ago, I basically went back to how it started, and I’d like to share what I have experienced in the last year of OS and distro hopping.

### Step 1: Windows 10

This is the OS that comes with the computer, which was also my work machine. While I’d like to try out Linux, my priority at the time was to keep it as stable as possible for me to get my actual work done, not playing around with random stuff. And as an Android Developer, developing on Windows is perfectly normal and fine.

### Step 2: elementary OS 0.4

Now that I don’t have to use my personal computer as work machine anymore, I can use whatever OS I want, and the first thing that I really want to try is elementary OS. It’s based on Ubuntu LTS, it looks great, and the feedback on the internet are also pretty damn positive. So I get it up and running, and it did not disappoint! It takes a while for me to get used to the lack of applications. It’s not terrible, after all, most desktop apps are powered by electron.js anyway, but still, it takes a while to get used to.

### Step 3: Ubuntu 18.04

While elementary OS looks and feels very nice, as a Linux newbie, it’s relatively hard to figure out what is going on, and there are a bunch of things that I never really figured out how to deal with, including:

* How to turn off the NVIDIA GPU when not needed

* How to get toolbar-only apps (e.g. VPN client) to show up

* How to get Chinese IME

So after a while, I feel like “uh why not”, and jump to Ubuntu 18.04. It’s definitely easier to find solutions that works, it’s just that I won’t call it “user friendly”. It definitely take some time to configure it to the way you like it, and for me, that is not what exactly I enjoy doing (anymore). But hey, it works, everything works correctly, and that’s definitely a nice thing to have!

### Step 4: Ubuntu 18.10

So when Ubuntu 18.10 comes out, I didn’t really think about it and just say “yea sure, why now”, and then I realize that’s probably not the best idea: a surprising amount of things just don’t work, or become hard to get. It took me like 2 days just to understand why I can’t get Docker to install, what the workaround is, and decide if I should just wait for them to make a new build for Ubuntu 18.10. While everything should work, there are often little things like “build script only check for LTS version” that bugs the hell out of me. So only after like a few weeks, I have decided to look for another option.

### Step 4: elementary OS 5.0

Now that I know sticking with LTS version of Ubuntu is important, but Ubuntu 18.04 is missing quite a lot of basic features (compare to other distro), I decided to give elementary OS a 2nd chance. They just multiply their version code by 10, which gives me a bit of extra confidence; it’s based on the new Ubuntu 18.04 LTS, so that’s also nice. While overall I still quite enjoy using it, there are still some kinks that I have to deal with, like “having to restart the machine for just switching between LoDPI and HiDPI”, “no status bar icon”, and “no easy way to switch between graphic cards so that it doesn’t kill the battery”. So after another few weeks, I decided to give another distro a shot.

### Step 5: Pop!_OS 18.04

Before switching to elementary OS 5.0, I was also considering Pop!_OS as well, since one of their selling point is the fact that it’s “developer-friendly”. And the only reason why i didn’t try it is because I already know I’m not gonna hate elementary OS, while Pop!_OS was still very much a question mark. And at the end, I still can’t tell if I like elementary OS or Pop!_OS more. Both of them looks great, both of them are based on Ubuntu 18.04, and they even work together to improve the user experience, like the store and the installation process. The reason why I ended up sticking with Pop!_OS longer than elementary OS is mostly because of compatibility, since it’s a much “thinner” skin of Ubuntu. It still runs GNOME, it still ship with all the normal applications, and it’s relatively easier to find solution to Ubuntu problems. And I think this is the 2nd most long-lasting distro I’ve used.

### Step 6: Windows 10 (+ elementary OS 5.0 as backup)

So, if I am quite satisfy with Pop!_OS, why the hell do I decided to jump the ship yet again? Well, it’s mostly just “grass is greener on the other side”. Microsoft keep announcing interesting features like WSL 2, I also start to miss a bunch of random features: Windows Hello (my T480 is equip with IR cameras & fingerprint sensor, both of them never work on any Linux distro), fractional scaling that (mostly) works, seamless switch between graphics, and not to mention, apps that are not available on Linux (e.g. anything from Adobe 😑). 2 weeks in and I have to say, I am quite enjoying it! WSL (1) is good enough for most of what I need to do, and now that I know how to use Docker also helps a lot. And again, since pretty much every desktop app I use regularly are based on electron, of course they are gonna be available on Windows. In fact, there are several electron app not available for Linux (Figma and GitHub Desktop for example). And when some stuff become too hard to deal with on Windows (e.g. the Jetpack Compose source code has a studiow, which downloads + open a specific version of Android Studio for Mac and Linux, but not windows), I can just switch to elementary OS on the other SSD. It’s not perfect, but for most case, this 80/20 time split is more than enough to get stuff done. And of course, there is always VM when “switching boot drive” feels “too exhausting”.

So, what have I learn from a year of distro hopping? Well, it’s kinda hard to say. I know a lot more about Linux: what it is, how to use it, it’s limitations, etc. I also know a lot more about what I am looking for in a computer: I don’t need powerful graphics, I do need great battery life, and I really really wish I would have gone for a bigger but a lower resolution, so that scaling won’t be such a big issue. Am I gonna try yet another OS anytime soon? I don’t think so, since I really really want to focus on things that matters. We’ll see if I actually stick to the plan this time 😂
