---
title: Test
author: Louis Tsai
date: 2019-04-30
hero: ./images/hero.jpg
excerpt: With the growing community interest in Gatsby, we hope to create more resources that make it easier for anyone to grasp the power of this incredible tool.
---
# Quick Tech Support: all the different SDK/build/whatever version you need to use to build an…

This article will tell you everything you need to know to deal with all those crazy version rules. Everything will come with source (a.k.a. answers on StackOverflow) if necessary.

1. minSdkVersion ≤ targetSdkVersion (dah)

1. [targetSdkVersion ≤ compileSdkVersion](https://medium.com/google-developers/picking-your-compilesdkversion-minsdkversion-targetsdkversion-a098a0341ebd)

1. [support libraries version = compileSdkVersio](https://stackoverflow.com/a/38072371/2384934)n

1. [compileSdkVersion ≤ buildToolsVersion](https://stackoverflow.com/a/24523113/2384934)

1. support libraries version ≤ buildToolsVersion (by combining no. 3 and no. 4)

1. [click and scroll down to see the mapping between Gradle Plugin version and Gradle version](https://developer.android.com/studio/releases/gradle-plugin.html)

TL;DR:

1. minSdkVersion ≤ targetSdkVersion = support libraries version = compileSdkVersion ≤ buildToolsVersion

1. Android Gradle Plugin depends on the Gradle version

Remark:

1. even though targetSdkVersion can be older than support libraries version & compileSdkVersion, [it does not seems to be recommended](https://medium.com/google-developers/picking-your-compilesdkversion-minsdkversion-targetsdkversion-a098a0341ebd), but I don’t know if there is anything that might break. If you have any experience/example/etc, let me know and I will update this document.

1. [the use of maxSdkVersion is generally discouraged](https://developer.android.com/guide/topics/manifest/uses-sdk-element.html)

1. Gradle Plugin nor Gradle depends on Android Studio version from what I can see, but they generally comes together, and if you upgrade to a newer version of Android Studio it will usually ask if you want to upgrade The Gradle Plugin to the newer version.
