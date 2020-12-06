---
title: "Let’s see if Flipper can make me a 1.1x engineer"
date: "2020-08-16T07:36:39Z"
description: "TL;DR: Flipper looks like a pretty cool way to build in-house dev tools"
---

![Website of Flipper](https://cdn-images-1.medium.com/max/1024/1*zcH7d_sJTAgIvdgWwUhH-g.png)

[Flipper](https://fbflipper.com/) is a debugging tool build by facebook, which in a sense is a spiritual successor to [Stetho](https://facebook.github.io/stetho/). For those who don’t know, Stetho is also a debugging tool, which allows Android apps to redirect a bunch of debugging data to chrome://inspect, most notably networking requests. I have used Stetho quite extensively in one of my last companies, because how easy it is to setup and use, so I do have some fond memory of it. However, slowly and gradually, it stops being maintain, and then I found out the existence of Flipper. So obviously the next logical step is to give it a shot, and see how useful it is 👀👀

### Setup

The process is actually quite straight forward, thanks to the pretty extensive-yet-not-too-verbose [documentation site](https://fbflipper.com/docs/getting-started/indexhttps://fbflipper.com/docs/getting-started/index). The only hurdle I ran into is when setting up the [networking plugin](https://fbflipper.com/docs/setup/network-plugin), you have to make sure you have the same instance of the plugin use by both the interceptor, and the setup step. I messed up some setup in Dagger, and it took me like a solid 30 minutes before I really how stupid I was 🤦‍♀

### Custom Plugin

So the biggest selling point of Flipper is probably it’s plugin API. **It opens the door to build project-specific and user-friendly GUI dev tools.**

In a lot of projects, probably at some point someone will think “hmm, what if I just wrote a script to make it easier to debug this?”, and then they hack the script together in record breaking time (because it’s usually the fun part), and tell the entire team “now your problem is solved”. But when team grow/change, suddenly everyone is relying on that script with little to no test, often convoluted code, and even more confusing and cryptic inputs/outputs (and stacktrace if something went terribly wrong).

So these are the problems that I hope Flipper can solve/mitigate:

- **Confusing to use** : By having a GUI, I can at least try to layout all the buttons and text in a way that is less confusing. And the fact that it uses React should also help make it easier to build the UI.
- **Too many dev tools** : By having just 1 debugging application, this can consolidate most of the random dev tools into just 1 windows, which should make it easier to deal with.
- **“Sketchy” dev tools** : It’s not that you cannot write script that testes those script, it’s just that by having a “normal” project setup, hopefully it can encourage me to not only write dev tools, but also write test to make sure those dev tools works in the long run

So with these goal in mind, here’s what I have learned:

- The **documentation of building your own native (i.e. apps) plugin is also very good**: on the [client side,](https://fbflipper.com/docs/tutorial/android/) it took me maybe 15 minutes to have a basic network plugin that filters out only the traffic that I care
- And for **building desktop plugin, it’s less good but still not terrible** : While [the documentation](https://fbflipper.com/docs/tutorial/js-setup) itself is still pretty good, there are quite a few issue that I ran into and with not a lot of useful debugging. The biggest problem I have is “how to get Flipper Desktop to see my plugin”, and according to the documentation, it is to add the path to the plugin to the config.json Flipper created in your machine. But it looks like if Flipper thinks the path you added is “wrong”, it will just remove it when Flipper Desktop closes. So it ended up taking me another hour of trial and error, and looking through the entire site to found [another page](https://fbflipper.com/docs/extending/js-setup#dynamically-loading-plugins) that explains what is the exact path that I should have used, and the fact that I should have run yarn watch to build the tar ball for Flipper to detect the plugin correctly.
- Depends on what you want to build, you can put the logic on the client plugin or desktop plugin. Putting logic on client side means writing those logic in Kotlin, which would have been a lot easier; but at the end **I’d recommend putting those logic on the desktop side** , in the hope that A) it might be share if the iOS all also adopts it, and B) my TypeScript knowledge is good enough, or worst case scenario, it’s not that hard to Google the solution.
- **Building a user-friendly desktop plugin is not as simple as it seems** , mostly because the level of abstraction that comes with Flipper is either too high, or too low. If you just want to show “a list of something”, createTablePlugin makes things very simple. But since I want to do some data processing before it shows on table, I ended up copying that entire file, make like 10 line changes in there to expose a lambda for me to sanitize the data, before showing it in the table.

Currently it is entirely still an experiment, and also I have not asked my boss if I can even share it. I hope in a month or 2, I will be able to share if Flipper turns out to be a good idea or not.

### 1.1x Engineer

And to end this blog post, I just want to do a quick shout-out to the [**1.1x/+10% engineer concept**](https://dev.to/tlakomy/become-a-10-engineer-g78). What I have started to realized that I like to do is to “help other people do what they are good at, but even better”, and I think more people should give it a shot. Imagine if every month, 1 of the engineers build/do something that makes everyone works 10% more efficient/more productive/happier, in 2 years, 1.1²⁴ = 9.85, i.e. the team will be almost **10 times better than 2 years ago**! And I am 1000% sure you cannot simulate these kind of growth just by hiring more people/“10x” engineers.

At the end of the day, I hope Flipper will allow me to make our team 10% more efficient, and so far it looks promising, and I recommend you to give it a shot!