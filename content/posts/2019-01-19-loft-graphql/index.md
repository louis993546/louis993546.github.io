---
title: Test
author: Louis Tsai
date: 2019-04-30
hero: ./images/hero.jpg
excerpt: With the growing community interest in Gatsby, we hope to create more resources that make it easier for anyone to grasp the power of this incredible tool.
---
# Loft: Choosing GraphQL instead of REST API (w/ the help of gqlgen)



Just like any other app out there, something has to deal with some data somewhere, and expose those data back somehow. And in the case of Loft, I thought the most logical solution is to build a REST API, just like everyone else. But about a month in, I have shot myself in the foot so many times, I am already looking for an alternative. As a greenfield project that is not being used by anyone, it’s the perfect time for me to find alternatives, and now I’m gonna tell you the why, the how, and the what’s next.

## Problem with REST API

If you have worked with any REST API before, you’ve probably complain about at least 1 of the following:

* Over/Under-fetching

* Naming Convention

* Data structure

* Platform-specific API/behaviour/structure/something

* etc.

The flexibility of the definition of “REST” means that people often have wildly different interpretation, and it takes a lot of time for everyone to come to terms with it. There are some “best practices” on how to make the discussion less time-consuming, like [JSON:API](https://jsonapi.org/) ,by defining a easily scalable structure, or [OpenAPI specification](https://www.openapis.org/), which is a specification on creating specification of API, so that reusable resources are more visible, hence more likely to be reuse. While I think all of these things are a step to the right direction, there’s always a feeling that it’s a bit too convoluted. All of these specifications, frameworks, and libraries exists because we want stability and predictability, but due to the lack of limitation of what “REST” is, we end up putting botch here and there to add reinforcement, and hope those things don’t drive people crazy in like 5 years.

And as an Android developer, working with type-safe language, on a platform that can’t guarantee user uses the latest version of the app, it’s straight up soul-sucking to see any of those bugs popping up once in a while and suck up an hour of your time, especially when you are in the middle of the zone. And when I try to implement logic which confine to all of those API specifications and best practices, the Android code turns out to be pretty god damn convoluted with Generics, null checks everywhere, and just a lot of boilerplate that makes it harder to see the actual business logic.

## How does GraphQL solve those problems

I am not a GraphQL expert, hell, I’m not even a backend expert. If you want to know more about GraphQL, there are tons and tons of articles and videos on what it is and how it different from REST. Google it, and then come back. I’ll wait.

GraphQL really feels like a client-focus, and it makes so much more sense for Loft: a mobile-only platform that helps people living together to not kill each other:

* Client decides what they want to fetch, say goodbye to over/under-fetching

* Now things can easily be fetch in nested manner, much closer to OOP than REST can ever do

* And since everything acts more like an object/a resource, naming convention also becomes less convoluted: the product can decide what a resource should be call, and what properties it should have, and there should be little to no repercussion from the schema design perspective.

* Again, since client decide what they want, making platform-specific code also feels less of a hassle/hack.

## The real MVP: 99designs/gqlgen

About a year and a half ago, when I was still working in homify, they have a hack-week thingy, and I took that chance to build a GraphQL using node.js + graphql/express-graphql. My relationship with JS is never ideal: I like it’s flexibility, and if all I want is to hack something together, node.js is often my first choice. But I don’t like maintaining thing written in JS at all: for things that needs stability and maintainability, IMO type-safe language is very useful. The other problem I have with express-graphql is that it’s not exactly easy to use: From what I remember, it’s a resolver-first library, and it does not have any safety check (and obviously no compile time safety, since you don’t need to compile JS at all), and unless you have a strong suite of tests (which is usually not something you do in a hack week project), bugs hiding in plain sight becomes more plausible.

So when I start looking for alternative to REST, one of the thing I try to search is GraphQL server implementation in type-safe languages, and one of the first thing that I found is a reddit post on golang with GraphQL, and the top comment mentions gqlgen, which lead me to this video

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/FdURVezcdcw" frameborder="0" allowfullscreen></iframe></center>

And my immediate reaction is

![](https://cdn-images-1.medium.com/max/2000/1*d0odgfD7kwYrC0O5Npoupg.gif)

Finally, someone made it easy to work with GraphQL in a language that I like, and it’s code generation approach makes so much more sense then what I’ve seen before. In the month I’ve used it, I really how much effort it saves me, and I can (mostly) focus on the business logic in the resolver layer, instead of how to configure all the little pieces together, or how to make sure the schema and the resolver matches with each other.

## What’s next

Now that the proof of concept is up and running, the next step will be to make it “demo-able”: all resolvers needs to at least work, authentication, rate limit, the basic stuff, so that the app gets to a point where I can ask my friends to try it out. I don’t expect to have a lot of GraphQL issue or gqlgen issues in this phrase, because there are already a lot of documentation on how those works. However, the next phrase “scaling” is gonna be fun: not only do I lack the experience or knowledge in load balancing, automation, network configuration, etc, there are also a lot of unknowns in the GraphQL and/or gqlgen side that I don’t know about. Maybe by then I will realized that GraphQL/gqlgen is not a good approach, but that’s kinda what it’s all about right? Trial and error, fail fast, and learn from your mistakes.
