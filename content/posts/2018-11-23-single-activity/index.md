---
title: Test
author: Louis Tsai
date: 2019-04-30
hero: ./images/hero.jpg
excerpt: With the growing community interest in Gatsby, we hope to create more resources that make it easier for anyone to grasp the power of this incredible tool.
---
# Loft: Using single Activity with Navigation Library: The good, the bad, and the ugly

In the last episode, I briefly mentioned that I have been using the Navigation Library from the architecture component. And today I am going to talk about my experience with it so far.

At the time of the writing, Navigation* *is still at 1.0.0-alpha07, but according to the great video from Ian Lake, it will finally move from alpha to a beta in near future.

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/2k8x8V77CrU" frameborder="0" allowfullscreen></iframe></center>

And for the people who are too lazy to watch a 40 minutes video, here’s some of the gist:

* Core concept: View Controller, a set of logic that ties different views together, hence the name View Controller

* In current Android world, there is no straight forward API for that

* Activitys are very loosely tied to one another

* Fragments have FragmentManager, which is more or less in that direction, but it’s not exactly the nicest API to work with

* Navigation Library is a bunch of things that makes using View Controller easy

* It’s essentially uses an Activity (and it’s FragmentManager) to act as the VC

* And obviously Fragments are the views that needs to be control

Got it? Good/Too Bad, we’re moving on!

So now you know basics of Navigation Library, let me tell you the story of my experience of using it

## The Good

1. It’s very easy to use. Seriously it’s only a few lines of code, and the visual editor is also very usable, compare to the layout editor. I don’t mean to shit on the layout editor, it’s just that the navigation does 1 thing only and it does it pretty got damn well: drawing directional arrows

1. It abstract all the crazy Fragments transactions. I don’t think I have every seen anyone who actually like using it. We all kinda have to, but if we have a choice, probably most of us don’t want to.

## The Bad

1. Modularization becomes kinda tricky: Like I said in my [last post](https://medium.com/@louis993546/loft-how-i-modularize-my-android-app-903cc28a662d), I have the bunch of Fragments in 2 modules (for now), and the main module implements the others to access the fragments. And in order for the child module to trigger the navigation to move from 1 view to another, I ended up creating a wrapper that allows Fragments to trigger the host Activity to do the transition for them, using onAttach(context). Basically it requires a bit of boilerplate.

1. Back track behavior: One of the thing that I have gotten used to is how the back button behave. If you open an app with a notification(or just deep link in general), and then press back, most apps will just close that activity and you will go back to the app you was on previously. There are also a bunch of apps that does the recommended behavior of “recreating the whole stack of views that the user would have to click to enter this view, so that the back button will back track each of the views”, and that’s why the navigation does. Is it a deal breaker? Probably not, but I kinda wish it can be a more flexible.

1. It is not a one size fits all solution: one of the things that it does work very well with is with ViewPager and PagerAdapter, because they are basically View Controller already. It gets tricky/boilerplate-y when you want to have a Fragment in the ViewPager to then change the whole view, which mean you will find your way to let your Fragments in the ViewPager to access the navigation controller from a layer out.

1. A lot of animation API is still in progress

## The Ugly

1. This one is not exactly about the library, but the status of the library: It’s still in alpha, and API did & can change with no alternative. But hopefully by the time you read this, it becomes stable (enough) for the project that you want to use it.

1. It’s still stuck with support library 27 (& “subsequently” targetSDK 27). Again, hopefully when you read this, it would have been updated.

1. It does not scale really well. In Loft, it’s not really an issue, but if your app has a lot of views, especially nested ones, the navigation graph can get pretty messy. For example, if you have like a BottomNavigationView of 5 items, you probably need 20 arrows pointing from 1 Fragment to another. And if one of them has maybe a TabLayout of 2 inside, now you may need up to 30 arrows. (the formula is n * n-1 , where n is the number of top level views)

## Conclusion

In my opinion, this is one of the more important library in their Google I/O 2018 announcement, because it solves a really huge and fundamental pain point of Android development. And if you are free, please try it out, and let the Android team know what you think about it, how it can be improve, and help them to bring this potentially world changing library & concept of navigation to the community!
