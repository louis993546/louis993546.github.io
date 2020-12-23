---
title: Test
author: Louis Tsai
date: 2019-04-30
hero: ./images/hero.jpg
excerpt: With the growing community interest in Gatsby, we hope to create more resources that make it easier for anyone to grasp the power of this incredible tool.
---
# From Android zero to kinda-middle: Don’t be scare, “Architecture” and “Pattern” just fancy words…

I just search for a photo that represents “sustainable” and this is what it comes up with (Photo by Jonathan Klok on Unsplash)

I remember when I first start programming IRL, I have absolutely no idea what architecture is, and I don’t really know where to get started. I have took a course in the previous semester that talk about Java design patterns, but most of those examples are either animals, coffee machines, or pizza menu. And when I look at the code base of the company I was interning for, I still have no idea what the hell is happening. And after 2 years professionally, I think I’ve finally got to a point where I am comfortable enough to actually engage in architecture discussions, and I am going to share with you how I slowly get to this point.

When you just get started, you probably write codes like this:

<iframe src="https://medium.com/media/5f5c6aa6e6aa6d089c01e40c8e28e0c9" frameborder=0></iframe>

While it definitely works, there is a 80% chance that in a few months, you will have some weird bugs, and you have to spend a million years to debug it. And when you thought it’s fixed, turns out that piece of buggy code was also copied to 3 other places, and it take yet another release to get all the fixes to users. Believe it or not, thousands if not millions of developers have experienced this at the early stage of their coding life, and after a lot of debates, discussions, and maybe a few fights, we have started to come up with some code structures that can make the code more maintainable in the long run. In a relatively small scale, we have a lot of so call “design patterns”, like singleton, factory, abstract factory, builder, etc., that more or less helps us reduce the amount of copy-and-paste code. And in a more macro level, people have also came up with some ideas on “how to split codes into different pieces, but all those pieces also need to be able to easily stitch back together”, and they are basically architectures.

So instead of giving you more coffee shop examples, I will try to give you some cases where a typical Android app could face, and some of the “ optimizations” that can be done to make it scale more easily.

### [Adapter](https://en.wikipedia.org/wiki/Adapter_pattern)

This is probably the most familiar term, mostly because it is one of the crucial building block of a RecyclerView. It’s concept is simple: class A can use an Adapter to turn itself into class B, and it’s also often call Wrapper. In the case of RecyclerView: It only cares about things to show on screen (i.e. ViewHolder), and since your source of data probably returns a list of users/profiles/articles/pictures/whatever, the RecyclerView.Adapter<? extends ViewHolder> class gives you a frame, so that you can transform whatever POJO/data class you have into a ViewHolder accordingly.

### [Singleton](https://en.wikipedia.org/wiki/Singleton_pattern)

While this one is pretty well-known, it’s also the most controversial one. It is often refer to anti-pattern, including being the first member of the [STUPID principle](https://williamdurand.fr/2013/07/30/from-stupid-to-solid-code/). Just like everything in life, the key is to know when is it suitable. For example:

### Good/Acceptable use cases:

* [having only 1 connection with the SQLite database to avoid running into some race condition or other pain-in-the-ass problems](https://stackoverflow.com/a/7989239/2384934)

* Honestly I can’t think of much……

### Questionable/Bad use cases:

* A class that only has functions and no state → Don’t make the class singleton, just make the functions static

* Share logic (e.g. Presenter) between classes → Look into dependency injection, and inject the same instance of that object into the right places, just scroll down a bit and I will give you a TL;DR.

* Almost anytime Context is involved. Memory leak is very real.

Side note: if you have too much time to kill, just read how everyone reacts to Singleton pattern [here](https://stackoverflow.com/questions/137975/what-is-so-bad-about-singletons)……

### [Factory](https://en.wikipedia.org/wiki/Factory_method_pattern)

I think after the course in university, I haven’t heard about factory for 2 years. The core concept is simple: instead of “I want a new instance of A”, you ask a “factory” to create an instance of A for you. And going back RecyclerView as an example: you can use a factory to simplify the code in onCreateViewHolder, so that it’s easier to understand what the hell is going on:

<iframe src="https://medium.com/media/bb41e58c5c62c44ffcdf5591e70a9fbd" frameborder=0></iframe>

And why would you do that? 1 common use case of factory is to abstract a lot of details, so that it’s easier to tell what is going on. Imagine if there’s not 2, but 10 different types of ViewHolder, plus each ViewHolder need need more parameters, it can be listeners/callbacks, some static info for all ViewHolder that’s only know-able at run time, or some type of delegate.

### [Abstract Factory](https://en.wikipedia.org/wiki/Abstract_factory_pattern)

Once you get the concept of Factory, Abstract Factory is not that hard to get: Instead of asking a specific factory to make a specific object, ask any factory that can make a type of object to make that object. And if we go back to RecyclerView as an example:

<iframe src="https://medium.com/media/0aa27dbcba39c62fa7d57d1ed77d2581" frameborder=0></iframe>

However, for this pattern, it’s kinda hard to have a very relatable example, because it requires a kinda special occasion to use it in a reasonable way:

1. firstly, the logic needs to be complicated enough to need to use factory in the first place

1. secondly, if you only have 1 implementation, factory will probably be enough (and it’s not hard to get an interface out of it)

1. thirdly, differences between implementations can’t be too different (e.g. needs different parameters), because in those cases, they probably should be spitted into different methods, and maybe even different factories.

1 practical example that I can think of is this: if you have 2 list of articles, 1 for “top stories”, the other for “latest stories”, and you want them to display slightly differently, so that high-quality top articles gets display with big picture and big text, while the “hot off the press and potentially awful” articles will have much less eye-catching layout. They both require the same input (an article and all it’s meta data), they both have the same interaction (click to open it), and even the list should provide the same behaviour (pagination, react to refresh, etc.). And in this case, your RecyclerView.Adapter can take an abstract factory as an input, so that you can provide the correct factory at run time.

### [Observer](https://en.wikipedia.org/wiki/Observer_pattern)

If you are already deep in RxJava or LiveData, congratulations, you already know what it is. And for those who don’t know: Observer pattern basically means “look at a box, and if it’s content changes, do something”. For example, you want to show the current location of the user, it will probably look something like this:

<iframe src="https://medium.com/media/99f983f56bd77cef8b87a1c9263f28f9" frameborder=0></iframe>

And in the world of RxJava, there are actually 5 major types of “observable” data types: Flowable, Observable, Single, Maybe, and Completable. The first 2 are useful for stream of data (like the stream of current location from the device), the last 3 are useful for one-off operations (e.g. calling a REST API). And to know more about all the little differences and how to use them, there are a billion great articles on the internet.

### [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)

While not in the book, this is probably one of the most talk-about pattern, because it is actually useful in so many different ways. The core concept of it is that instead of instantiate a new (probably heavy) object in a class, a class can probably just ask for it. And to get started, one of the biggest benefit of this is that components will become a lot more independently testable, with the help of a mocking library. For example:

<iframe src="https://medium.com/media/a205c9a83c6c28e2d2b5b49da3b32275" frameborder=0></iframe>

And the thing is, you don’t have to jump straight to Dagger/koin/kodein/whatever library that you have heard. You can just start simple by moving big dependencies to the constructor, so that the layer up has to pass it down. And once you got the hang of it, you can start to look into the crazy world of DI, DI in Java, DI in Kotlin, and more.

### [Bonus: Builder](https://en.wikipedia.org/wiki/Builder_pattern)

If you are writing new code in Kotlin, [name](https://kotlinlang.org/docs/reference/functions.html#named-arguments) + [default](https://kotlinlang.org/docs/reference/functions.html#default-arguments) argument solves 50% of the use cases, and [apply { }](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) solves the other 49% of use cases. It’s just that most Android API are still written in Java, and back in the days, builder is the best tool we have to dynamically construct an object that can have a billion parameters. So these are just a few minor tips that I think you should be aware of:

* Most Builder don’t care about the order of the steps, but not all

* If it’s setSomething, calling it multiple times probably are not gonna combines all the inputs; and if it’s addSomething, it probably does.

* Just dig into the source code of Builder. Android Studio has a nice class decompiler, and you can get a basic idea of what’s going on, and see if you are calling it wrong, or it the documentation not up-to-date, or you have made a mistake.

If you are still reading this, I hope you are now less scare of the word “architecture” and “pattern”, and remember, your college are probably happy to help you as well, all you have to do is ask 🤗
