---
title: Test
author: Louis Tsai
date: 2019-04-30
hero: ./images/hero.jpg
excerpt: With the growing community interest in Gatsby, we hope to create more resources that make it easier for anyone to grasp the power of this incredible tool.
---
# Mental Models of Jetpack Compose #3: Inheritance, Composition, and why they matter



*Previously, on MMoJC:*

* *We talked about what even is mental model*

* *We talked about what is state*

* *We talked about what is Programming Model*

* *We talked about Declarative UI*

* *We talked about separation of concerns*

And for today, I’d like to talk about Inheritance & Composition in the context ([no not that Context😂](https://twitter.com/ataulm/status/1185637270730268672)) of Android.

## Inheritance

Android was born (officially) in 2008: Java 1.6, JavaScript is just some things you use to animate stuff, not build a full blown web app, not even the word “app” is a thing just yet. And when it comes time to build all the basic view components, there are probably quite a lot of restrictions on what they can build in a limited amount of time (esp. since iPhone just got released, the pressure is on!). So in order to encourage code-reuse (i.e. DRY), they made a View class that every classes extend from, and then they can add extra functionality, and it just keep growing like that, [just like a tree](https://www.reddit.com/r/ProgrammerHumor/comments/8ek3ot/shots_were_fired_in_my_discrete_math_textbook/).

![](https://cdn-images-1.medium.com/max/2980/1*Fdawx1uv8swSvhgsg14Cdg.png)

## What’s wrong with inheritance

While it definitely helps everyone to reuse UI code, like “Button don’t have to implement their own text rendering logic”, it is also very limiting on building complex things, which turns out to be the case, when Android become the most popular OS in the world.

For example: Button with an image instead of text. When I first start learning Android, at some point I was trying to use an image instead of text for a button, so when I find ImageButton, I was like “jackpot”, and just converted it in the XML. but then 20 seconds later, everything broke, and I got a bunch of compile error. Turns out a lot of the functions that I was calling from the Java side don’t work anymore, and it’s because Button and ImageButton, although share a very similar name, has almost nothing in common 😐

![ImageButton and Button are both View, so that's something I guess 🙆‍♀️](https://cdn-images-1.medium.com/max/2980/1*MQN1tnnnJDIxPqh7Gj3lHg.png)*ImageButton and Button are both View, so that's something I guess 🙆‍♀️*

Maybe the Android team could have design these 2 views the other way around? But in general I hope you got the point of “how difficult it is to predict how people mutate their UI, and what would be the best hierarchy to ensure high level of compatibility”.

There is another way people discover this to be an issue over time, and it’s when people try to update existing UI: we get some ticket on what new feature we needs to implement in the UI, we updated that View, and make sure it’s covered with test. What could possibly go wrong? Well, if you are building a library of views that thousands if not millions of other classes inherent from, too bad! Since there is no clear mechanism to warn every single places that extends from you to double check if the change in behaviour is acceptable, you kinda just have to prey nothing went wrong. One example that the Google team pointed out is the “selectable text in Button”, which maybe 3 apps in the world needs it.

![](https://cdn-images-1.medium.com/max/2560/1*ugomrHFMusnZRLkbt0gEwg.png)

**TL;DR: Building UI with inheritance does not scale over space and time**

(BTW inheritance is not the only thing that didn’t aged well with View, but that’s story for another day)

## **Composition: Is it the answer we are looking for?**

So how else can we build reuseable View? For that, let see if composition helps: Instead of saying “Button = modify view to show text, and modify text to have a specific style”, just say “Button = Whatever hint you want + some background + click callback”. And an example for that can be seen in Flutter, like this:

<iframe src="https://medium.com/media/b954722363f4154bff5eeb209c18658a" frameborder=0></iframe>

And all of these are technically possible in the past, but the developer experience/ergonomics will be so bad, no one will like to develop for the platform to begin with! With much better tooling like IDE with crazy-good autocomplete support, build system that can process a huge amount of dependencies, and stack traces that gets more and more human-friendly over time, we are start to utilize composition to our advantage!

So is it the “ultimate” solution to UI building? It’s closer, but there are still some gaps to fill, and with the each of the composition-based UI framework, there are different trade-offs they’ve made, and that’s what we will cover in the next chapter!

Hope you like what I have wrote, and if you have any feedback or anything, feel free to leave a comments down below! Thanks!
