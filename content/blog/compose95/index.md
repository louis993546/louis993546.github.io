---
title: "Random Compose Project #1: Compose95"
date: "2020-07-25T12:00:00Z"
description: "How to build extremely specific and out-dated design with Jetpack Compose (thread 1/100000)"
---

### Random Compose Project #1: Compose95

Jetpack Compose is getting closer and closer to becoming “stable enough”, and for the next few weeks/months, I will be working on a bunch of completely random projects, and document what I have learned along the way.

**TL;DR: This is not tutorial/how-to of Jetpack Compose at all. This is just blog post of my experience of using it.**

### What is Compose95

As it’s name suggest, it’s trying to build Jetpack Compose that looks like it’s 1995, more specifically, Windows 95. It is inspired by Miguel Beltran’s work on [Flutter95](https://github.com/miquelbeltran/flutter95), which is inspired by Artur Bień’s [React95](https://github.com/arturbien/React95)

![Screenshot of Flutter95 on GitHub](https://cdn-images-1.medium.com/max/1200/1*jt7pi5ngR2aNOLD5QsM81g.png)miquelbeltran/flutter95

![Screenshot of home page of React95 on GitHub](https://cdn-images-1.medium.com/max/1200/1*nkfvrtln7TS2C4KWywN7fw.png)arturbien/React95

### What am I building, exactly?

For this post, I am documenting what I went through when buildling

- Window (most of it)
- Button

It’s all open-source, click [here](https://github.com/louis993546/Compose95) to judge how bad the code is 😂

### Window

Window is the relatively straight forward component to build. It is basically just a container with a bar at the top, optionally the ability to minify/maximize/close the window, which doesn’t make sense in the case of an Android app anyway.

![Screenshot of Android Studio, which has code of Window95, Preview of Window95, and an emulator showing what it looks like](https://cdn-images-1.medium.com/max/2400/1*55NcXvojhGPXkBYD10d2_A.png)

As you can see, `Windows95` is pretty straight forward. The most "complicated" part is probably the border. If you remember, Windows 95 is very skeuomorphism (is this word an adjective?), and the borders colors really sells the elevation, even to this date. I am not saying it looks great, but it certainly is effective. Using React95 as reference, I can see that the border is actually more like 2 boarders:

- 1 on the outsize with pure white or black
- 1 on the inside a few shares of grey to make it look more like shadow, instead of just color borders

And to achieve that look, basically I have to figure out how to draw border that has different color accordingly, and that means digging into what `.drawBorder` is doing. Since it is a receiver function of `Modifier`, of course there is a `Modifier.Element` powering it, in this case: `DrawModifier`. And once you get the draw scope inside of it, you just have to figure out the coordinates, and then it is not too complicated to draw the 8 lines.

And 1 last thing: if you check `DrawBorder`, you can see there are a lot more complexity inside, with how round corner should be, and most importantly cache. At some point `Window95` probably should do that, but it is way too early for me to do any kind of optimization. Hell the code still looks like shit.

### Button

`Button95` is also structurally quite simple, the "biggest" challenge is to figure out how to detect press state, and flip the borders around to sell the effect of "from above surface to below surface". And to figure out how, I digged into `.ripple`.

Inside `.ripple`, I found `RippleModifier`, but there is nothing too interesting to look into, since it looks like most of the code is about the animation of the ripple. What I want in this case is just a very basic "is it pressed or not" callback of some sort. And after I while, I realized that there are more than 1 argument for `.clickable`, esp. `Indication`. It is exactly what I need in this case.

![Screenshot of Android Studio, which has code of Button95, Preview of Button95, and an emulator showing what it looks like](https://cdn-images-1.medium.com/max/2400/1*8syesNMCHQ-yswfx6-rqwQ.png)

What `Indication` does is actually more like `IndicationFactory`, which creates `IndicationInstance`, and that `IndicationInstance` just have a function that gets a `ContentDrawScope` to draw whatever I want. And now things are starting to look very similar to how I draw the boarders in`Window95`, except I have to check `interactionState` to see what color each border should be.

![A GIF of Button95 being click, and what happens when it got long press (content got highlited)](https://cdn-images-1.medium.com/max/1600/1*5y3sebbyauJ_H3A6XFs2WA.gif)

While technically not a bug, it looks like I still have some work to do to figure out how to make it behave more naturally……

This is the end of this blog post, it is absolutely gonna take me forever to get it to a working state. I wish I have more energy and time to work on stuff like this……