
# Prepare a Jetpack Compose talk with me #3: Basics & fundamentals

It starts with excitement, but 30s later, the horror starts to set in……
> # So, for some stupid reason, I submitted a session to droidcon Berlin, saying that I will spend 15-ish minutes to present the inner workings of Jetpack Compose. And in July 2nd, I will need to go on stage and present it. Join me on the journey to either the ultimate humiliation, or the beginning of giving something back to the Android dev community!

*Before getting started on the important bits, just a quick self-reflection on the first 2 “entries” of this series:*

1. *Splitting them into really tiny stories with basically no context is **THE WORST IDEA EVER***

1. *I have to write things that are a bit more sustainable. I don’t have the memory to “go back to this post to update it regularly”. That’s what places like Twitter or Reddit is good at, not a blog post people forget in 2 seconds apart from “oh I saw it on Medium”.*

*So from this point on, it will start to look more like any normal Medium article. Let’s get back to the main course!*

## What it IS?

### Part 1: a way to bring “reactive programming model” to native Android development

React.js got released to public in 2013, while it took some convincing, it ultimately popularize the idea of “UI as code”/“Declarative UI”.

In a very simplified term: you can think of it as “data binding on steroid, powered by a real programming language”: instead of having xml/html templates + Java/Kotlin/JS code to manipulate the layout, you just mesh the 2 things together. And since now they are together, instead of “hey, that TextView/Label/<p>, change the text to *The talk is 13 days away and you are so screwed*”, all a component needs to do is “This is the message, now put it on screen”.

(Again, hugely simplified here ☝️)

### Part 2: a new “unbundled toolkit” to make Part 1 possible

In order to make this new programming paradigm possible (or at least to not kill more Android developer than it have already), a bunch of new stuff are build, not only to make it possible, but to create a good user (development) experience as well.

## What it LOOKS LIKE?

<iframe src="https://medium.com/media/5904e5bf127e27ab743ad3c0f8825b63" frameborder=0></iframe>

Translation: There is a widget call Greeting, it has 1 property: name, and what it does is “it draw a modified version of name onto the screen (somehow)”.

## **WHY?**

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/VsStyq4Lzxo" frameborder="0" allowfullscreen></iframe></center>

TL;DR:

* Existing UI framework is design in the Java 1.4/5 world

* Some design decisions age badly

* React/flutter/${insert yet another React-inspire framework here} shows the world what “UI as code” can be in 2018+

* Kotlin is (one of) the last piece of puzzles to trigger them to rethink what Android UI framework can be in 2018+

## What is the toolkit made of?

### 1. Runtime: we will talk about it next time

### 2. Compiler: we will talk about it next time

### 3. Tooling

At the time of the writing, there is not much to talk about. It’s definitely something they are aware of, but at this point “getting the code works” is a much higher priority. The 1 thing that just comes automatically from the paradigm is that since UI is code, you can now very easily debug it already 🎉 Put a break point works, you can see what exact color/padding/margin/whatever parameter/component is being instantiated, and what value is being pass to it 👍

(Side note: IMO what Xcode has for SwiftUI looks awesome 🤤)

## In a very simplified version, how does each “component” draw stuff if it’s not a android.view.View?

There is no black magic or anything crazy: it just use a (slightly abstracted version of) canvas. For example: Text (~ android.widget.TextView)

<iframe src="https://medium.com/media/77e59839b20bf4979510b122b2e02883" frameborder=0></iframe>

So it does **NOT** use View (with a few exceptions), it re-implements a lot of the basic building blocks of UI, which is why it’s “unbundled”. But other than that, it’s also nothing too special or magical.

(Why it abstracted canvas? Maybe cross-platform? Or maybe just to make it easy to test on even normal JVM? 🤷)

## On the other side of the spectrum: how does it get that canvas? How does it get attach to the traditional world of Android UI?

Compose ultimately needs to attach itself to a ViewGroup, and that ViewGroup can be attach to wherever you want it to be. In the current implementation, they just created some simple extension function for Activity to make it looks nicer.

This is one of the other thing that I am obviously simplifying a lot, but that’s also kind of the point of compose to begin with 🤷 I promise I will tell you guys a lot more in the internals of the runtime and compiler, but honestly, binding back to the traditional Android API is just not that interesting to me.

In the next chapter, I will start digging into “how to create a component”, and why it is structure the way it is (annotation, function with no return type, etc.). Stay tune!
