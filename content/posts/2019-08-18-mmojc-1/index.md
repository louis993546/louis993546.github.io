---
title: Test
author: Louis Tsai
date: 2019-04-30
hero: ./images/hero.jpg
excerpt: With the growing community interest in Gatsby, we hope to create more resources that make it easier for anyone to grasp the power of this incredible tool.
---
# Mental Models of Jetpack Compose #1: State & Programming Models

Update (2019.08.19): Chapter 2 is now up 🎉

![Generic representation of “mental model”. I don’t really know how to visualize this concept 🤷](https://cdn-images-1.medium.com/max/2048/1*zij_6EWgVip4GyOtH8zBMA.jpeg)*Generic representation of “mental model”. I don’t really know how to visualize this concept 🤷*

So last month, droidcon Berlin happened, and [I gave a talk on Jetpack Compose](https://twitter.com/droidconBerlin/status/1140894454909419520), and [gave a brief overview of the internals, and some decisions they have made](https://speakerdeck.com/louistsaitszho/jumping-into-jetpack-compose-way-too-early-to-see-whats-inside).

I did wrote [a bunch of blog posts](https://medium.com/@louis993546/prepare-a-jetpack-compose-talk-with-me-1-where-do-i-even-start-2c54851d900) leading up to the conference, and I really appreciate all the supports. While the videos are still not available 😠, and there is also not much feedback from the attendees, I do feel like there are a lot of basics that should have been covered instead. So today, I would like to give you guys a brief overview of a bunch of so call “Mental Models”, which IMO is the 1st step to get you to understand what Jetpack Compose really means to being an Android Developer in the future.

So first, before talking about any mental models, let’s briefly talk about what even is it, and why I think they are important. According to Wikipedia:
> A mental model is an **explanation** of someone’s thought process about how something works in the real world.

First and foremost, it’s an explanation. Second, it’s from a person, so it can be personal, subjective, even over-simplified (i.e. technically wrong).

And why is it important know some mental models to understand Jetpack Compose? In my opinion, there are so many potentially earth-shattering changes that Jetpack Compose brings, and along with it, a bunch of current best practices or standards are gonna be obsolete at best, and flat out wrong in some cases. And just like the transition from Jave to Kotlin, or AsyncTask to Rx, or Rx to Coroutine, there are some things you might want to un-learn, and in order to un-learn those things, you have to wrap your head around the original problem, and then reapply the new way of thinking onto it, i.e. the mental model.

## State

Unless you are playing [apk golf](https://github.com/fractalwrench/ApkGolf), your apps have [states](https://en.wikipedia.org/wiki/State_%28computer_science%29). The view have states, your logic have states, there’re states everywhere. Basically if your code **remembers** any event (it can be text change, network response, system callback, pretty much anything), your application is consider “stateful”, and that piece of data is a “state”. All those event only happen for a few milliseconds, and a state exists to persist it longer that.

And what you usually do with any state is to transform the view accordingly. Some common examples include:

* When the flag checkCheckbox == true, then set a CheckBox to checked

* When the List<User> changes, then set the ProgressBar to GONE, and set the RecyclerView to VISIBLE.

## Programming Models/Paradigm

So your program have states, but how do we change between them? We do that with code, and the different ways we write code is what we call “Programming Models” or “[Programming Paradigms](https://en.wikipedia.org/wiki/Programming_paradigm)”. And when I say “different ways”, I don’t just mean programming languages, or architectures, or “how many ways to add 1 to x”(++x, x++, x += 1, x = x + 1, and more).There is a fundamental thought process baked into the language design, the standard libraries, and everything in-between, and that defines how we come up with solutions.

### Imperative programming

TL;DR: In [imperative programming](https://en.wikipedia.org/wiki/Imperative_programming), you use statements (or so call “instructions”) to change the state of a program. As a programmer, you are in charge of writing **how** to change a state, like every setText, every notifyDataSetChanged, and every invalidate. If you trigger it multiple times, you might not generate the same result; and if you trigger it at different state, it might not generate the same result as well.

### Declarative programming

TL;DR: In [declarative programming](https://en.wikipedia.org/wiki/Declarative_programming), instead of writing how a program should perform, you more or less just write a general rule/expected outcome.

* In SQL, you don’t write “go to the beginning of the user table, and extract 5 rows”, you just write “fetch 5 items from the user table”.

* In regular expressions, you don’t write “split the input by ., and then count how many groups are there”, you go to [StackOverflow and copy the most upvoted answer](https://stackoverflow.com/questions/5284147/validating-ipv4-addresses-with-regexp) on “the rule of digits-dot-digits-dot-digits-dot-digits”, i.e. IP address.

* And in Android layout (we are talking about xml here), you don’t write “add TextView to LinearLayout, and then add another TextView to that LinearLayout”, you write 2 TextViews surrounded by a LinearLayout.

And once you wrote all of that, you pass it off to someone: SQLite, java.util.regex.Pattern, and LayoutInflator, and they will magically find a (probably) efficient way to give you the result you expected.

One thing to note is that there can be quite a bit of overlap/intertwine between these 2 models, and RecyclerView is a good example: the ViewHolder pattern is quite declarative: it doesn’t really care who/how/why someone trigger’s it, you just render the ViewHolder according to the input; while the Adapter is very much imperative, since you are responsible using statement(s) to notify the right position to trigger that specific ViewHolder to update.

It’s also not that uncommon to wrap existing imperative code in a declarative way, and the [Navigation Component](https://developer.android.com/guide/navigation/navigation-getting-started) is a good example for that. It is powered by all the existing Fragment APIs, but instead of imperatively giving the manager a transaction, we declaratively pre-define all the possible screens and directions between them, and the correct transaction will be generated and executed. Other common examples includes

* JSON parsing with Moshi’s codegen

* Data binding

* And pretty much everything Gradle does

Some of them are generate code at compile time, some of them just transform them into the correct parameter at runtime, either way, as a user of those libraries, you are only responsible for asking “what”, not “how”. And while Wikipedia list Java (and presumably Kotlin) as imperative languages, it is also not uncommon for them to get some features that is more declarative, most notably, annotation, and DSL.

So this wraps up the first chapter of “Mental Models of Jetpack Compose”, and a few more chapters have already been planned. If you want to know more, or if there are any comments, or if I have made any mistakes, please feel free to let me know 🤗
