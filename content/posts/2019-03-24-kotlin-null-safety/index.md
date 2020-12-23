---
title: Test
author: Louis Tsai
date: 2019-04-30
hero: ./images/hero.jpg
excerpt: With the growing community interest in Gatsby, we hope to create more resources that make it easier for anyone to grasp the power of this incredible tool.
---
# From Android zero to kinda-middle: What Kotlin null safety means to your code base and product

I guess it’s a metaphor of Kotlin? IDK. (Credit: @andreilazarev on Unsplash)

First off, if you are still not learning or using Kotlin, I highly recommend you to check out the 2 bizillion articles online on why Kotlin is great, esp. for Android development. Now, let’s talk about how all those null safety works, and what you should be aware of when using them.

## Null safety with Java

When you write Kotlin code, it got converted to bytecode just like any Java code. It goes through the Kotlin compiler instead of Java compiler, but the output is still bytecode, and that is the reason why Kotlin and Java code are extremely compatible. And on the other hand, it also means that all the null safety feature needs to somehow be as compatible with Java. So how do they do it?

For fun something(someObject: SomeObject) in Kotlin, it basically got converted into bytecode that roughly translates to public void something(@NonNull SomeObject someObject) in Java. In compile time, the non-nullable type got converted into an annotation, and if nothing goes wrong, you will see it as warning message on Android Studio as a highlight, and as warning message in the output console of Gradle. And on top of that, Kotlin adds a call to make sure it’s not null at runtime, and if it is, it throws a KotlinNullPointerException. This is literally what that function looks like

    public static void checkNotNull(Object object) {
        if (object == null) {
            *throwNpe*();
        }
    }

So, what’s the take-away? For all the Java code, try your best to add as much @Nullable or @NonNull annotation as possible. I know they are verbose and kinda ugly, especially for stuff like data classes, but I think for most projects, the benefit of compile time warning/error of the “Million Dollar Mistakes” are gonna be very worth it. And when it’s time to convert them to Kotlin, you will love how they all got converted with the correct type 👍

## To ? or not to ?

In Java, you can always if (something != null) { something.something() }, it’s just that it’s kinda verbose (just like most of the language), and since we spent more time reading code than writing code, all these “error handling” makes the code logic harder to comprehend than it should be. That’s why everyone loves the existence of ? in Kotlin, and we have all been enjoying how much has improved for the readability of the code. But, the fact that it’s so easy to use, also means that it could be abuse. The most common example is stuff like user?.token?.let { something(it) }. At first, it looks like it gets it’s job done: a short and simple way to prevent NPE, but are you sure that’s the most logical fix for that code? Can you be sure that “something(token: String) never calls” is an acceptable behaviour?

Kotlin’s ? makes it super easy to practice what’s call “[Defensive programming](https://en.wikipedia.org/wiki/Defensive_programming)”, which encourage the practice of handling as many edge cases, errors, etc. that you can imagine, in order to provide a smooth and continuous operation of the code. While it’s a good idea in theory, just like everything else in life, it can easily turns into problems (and sufferings, and the downfall of the humanities I assume) when people start abusing it. On the other end of the spectrum, we also have “[Offensive programming](https://en.wikipedia.org/wiki/Offensive_programming)”. And no, typing hateful personal comment to your team mate in the code base is not “offensive programming”, it’s just call being a dick. What it really means is that it encourages you do only code the error handling part when you really know what it means, and how it should be handle. Even if you know which line of code is crashing the app, if you don’t know how it got there, or how to fix it, don’t. And it the case of Kotlin nullable type, it roughly translates to !!, but be aware that it’s not just about null or not, but all the error handling in general. That includes network error (e.g. 5XX, invalid response from API, Rx operator throws exception), platform API error (e.g. commit after saved state, db closed too early), and every edge and error cases in your business logic.

So, what’s the takeaway here? In my opinion, there is no right approach, just like everything else in life, like I said before. If you LITERALLY handle none of the error just because the designer forgot to specify it, you are gonna be getting a lot of angry feedback from the rest of the team, and probably users as well; And if you just wrap the whole app in a big try-catch, the same is probably gonna happen. You need to be aware that what error can happen, what can be handle in which part of the code, and how those errors should be tracked. For example, what “technically impossible” cases exists, how to monitor how often those “impossible case” occurs, so that you can be notify when and how it happens. All of these depends on your team, your product, and your users, your code base, etc., so please for the love of god talk to them, figure out what edge cases exists, which one needs to be handle, and how to handle them. There is no shortcut. All Kotlin can do is to help you in compile time as much as possible, and make those error handling code easier to write and read.

I hope you now have a better understanding of Kotlin null safety features, and I will see you guys in the next chapter of this series!
