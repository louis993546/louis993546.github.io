---
title: Test
author: Louis Tsai
date: 2019-04-30
hero: ./images/hero.jpg
excerpt: With the growing community interest in Gatsby, we hope to create more resources that make it easier for anyone to grasp the power of this incredible tool.
---
# From Android zero to kinda-middle: understanding what Gradle is & does

Side note: Google Drawing like Paint but much worse, but hey, if it works, it works!

You have been making Android apps for a few months, you know several keyboard shortcuts in Android Studio to make your life easier, and you start to know what libraries are and how to use them. You usually just copy a line from some GitHub repo’s README.md into your project’s build.gradle. No, not that one, the other one. And after you click sync, you can use some new API. That’s neat! But do you know what it actually does, and maybe more importantly, why should you care? Isn’t “*letting the smart people takes care of the complicated implementation*” the point of using libraries?

If you look at your Android project, you will see there’s the app needs to use: java/kotlin code, layout files, drawables, AndroidManifest.xml, translations, and whatever 3rd party libraries config files that’s needed. So how exactly does all of these got bundle up together into a single apk/aab? While there are ways for you to do it manually (after all, apk is just a zip file with extra steps), you generally don’t want to do that, since it takes a lot of effort to get it done correctly. So instead, we use “build tool” to do that, and that’s exactly what they do and what they are: **they are tools that build the final product**, and Gradle is one of them.

So obviously, one of the things that Gradle does is that it understand what files exist in where, and somehow use them to generate the output product, but what else does Gradle do? If you have ever add something like

implementation “com.google……”

or

compile “com.google………”

in the dependency {} section of build.gradle, you have already use another one of their feature: **dependency management**. When we use a library, e.g. square/retrofit, we “depend” on retrofit, which makes retrofit a “dependency” of the project. And while we can just go to each of the library’s README.md and download the .jar/.aar manually, it would probably be a better idea to simplify this whole process. What if someone can tell you which library has a new version? What if you have a new team member, and they don’t have to go to each site to fetch everything manually? What if it’s easy to see which exact version the project is depending on, instead of having a bunch of retrofit(1).jar and not knowing which one is which? That’s what the dependency {} section of build.gradle does. You essentially declare “I need which version of which library”, and Gradle will do the fetching for you. And where exactly does it fetch the libraries from? That’s in the repositories{} section. Those “repository” is not the same as Git’s “repository”. Instead, they behave much like a physical store does: if you want to publish(“sell”) something, you can upload your .jar/.aar to those repositories(“put them on the shelf”), and they will handle the rest for you. And stuff like jcenter(), google(), and mavenCentral() are just 3 of the most common repositories.

Now that you have your code, and all the dependencies, how do you actually tell Gradle to run? Like how does the “Run” button in Android Studio work? Well, after looking through the build.gradle file, Gradle will generate a list of tasks that you can execute. And if you open the terminal in Android Studio, you can type something like

./gradlew build

And what it does is that it will try to find a task call “build” and then run whatever logic is in there. Note that the command is gradlew, not gradle, and that’s because it uses a thing call Gradle Wrapper, which takes care of a bunch of other stuff like installation, versioning of Gradle itself, so that you can focus on **using** Gradle, instead of **configurating** Gradle. At this point in time, knowing it exists to help you is probably enough. And if you want to know more, Google is always here to help.

The last thing I want to mention is not what feature Gradle has, but just a tip of what you can do with it: While our code is in java/kotlin/xml, build.gradle uses a language call **Groovy**. It’s another JVM language, which means it has some compatibility with Java. While the syntax is quite different, since it has access to a lot of Java API, you can actually put some logic in there! For example, one of the simplest thing that you can try is to [make the versionName and/or versionCode increase programmatically](https://stackoverflow.com/a/19184323/2384934). Try it out, and get some basic understanding of how Groovy works, and at some point it will probably help you debug some random bug at some point! (And if you are working with a team, talk to them, make sure it won’t mess things up, and other people are OK with it first.)

This is just a really simplified version of what Gradle is and does, and I hope you still enjoy this series of posts. If you have feedback, tips, tricks, rant, recipe, survival guide for zombie apocalypse, etc, leave a comments down below!
