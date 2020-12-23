---
title: Test
author: Louis Tsai
date: 2019-04-30
hero: ./images/hero.jpg
excerpt: With the growing community interest in Gatsby, we hope to create more resources that make it easier for anyone to grasp the power of this incredible tool.
---
# From gqlgen to GraphQL.js: a story of “choosing the right tool for the right job”

Oh this? It has nothing to do with the content, I just took this yesterday and I quite like it ¯\_(ツ)_/¯

A few months ago, I briefly talked about [using gqlgen to create a backend](https://medium.com/@louis993546/loft-choosing-graphql-instead-of-rest-api-w-the-help-of-gqlgen-14c8643ee9a1) for a now [“postponed” project](https://medium.com/@louis993546/loft-ill-be-back-974b748f5d19). And after that, I have been trying to create a GraphQL wrapper for the official HackerNews REST API.
[**louistsaitszho/HackerNews-GraphQL**
*Wrap the HackerNews REST API in GraphQL. Contribute to louistsaitszho/HackerNews-GraphQL development by creating an…*github.com](https://github.com/louistsaitszho/HackerNews-GraphQL)
[**HackerNews/API**
*Documentation and Samples for the Official HN API. Contribute to HackerNews/API development by creating an account on…*github.com](https://github.com/HackerNews/API)

And about a week ago, I finally said “screw it”, delete everything, and restart from scratch with GraphQL.js
[**99designs/gqlgen**
*go generate based graphql server library. Contribute to 99designs/gqlgen development by creating an account on GitHub.*github.com](https://github.com/99designs/gqlgen)
[**graphql/graphql-js**
*A reference implementation of GraphQL for JavaScript - graphql/graphql-js*github.com](https://github.com/graphql/graphql-js)

So what went wrong? Is it because of Go? Is it because of gqlgen? Or is there something/someone else to blame? Let’s find out!

So, the premise of the project is simple: the REST API is kinda weird, since it returns (almost) exclusively just ID. Clients will have to fire a billion extra requests to get enough data to show on screen. This is probably not a good thing, especially for mobile devices, so let’s use GraphQL as a proxy, and expose the flexibility to the client. The (presumably) powerful server does most of the heavy lifting, and in might even be able to add some clever caching mechanism at some point.

So I started the project with Go and gqlgen, mostly because of 3 reasons:

* I want to practice my Go skills

* I have use gqlgen before

* The premise of “type safe + codegen” seems like a perfect fit for GraphQL

And I still stand by all those reason why I chose it in the first place. And at the beginning, it doesn’t take long to whip out a super simple “happy path only + not efficient” schema + resolver + query. But the moment I start to drill down a bit, it starts to get kinda convoluted. Here’s a list of things that I have to figure out how to solve with my very limited knowledge of Go & gqlgen:

* If the query only ask for id, it should not invoke any extra API call. That means I need to tell gqlgen to use resolver to get every-single-field-in-basically-every-single-type. It gets really verbose real fast.

* The ID for item (story, comment, job listing, poll, poll option) is an integer, while the ID for user is a string (like handler for twitter), but I can’t teach gqlgen to interpret GraphQL’s ID type to 2 different type at the same time.

* It took me way too long to realized that I should at least put the resolver functions into another file, so that when I have to update the schema and regenerate resolver.go, I don’t have to painfully put the logic back in -_-

* Update from dep to mod. Not really a problem, just something I have to deal with.

* etc.

And after like 2 month, I really starting to feel like I am fighting both Go and gqlgen at every level. I just want to get a Hacker News API in GraphQL done. There’s got to be a better way.

![*my brain after 2 months*](https://cdn-images-1.medium.com/max/2000/1*XHhbQ21lLyLw3i2i6qeNEw.gif)**my brain after 2 months**

Since I don’t control Hacker News, nor its API, I will have to adjust how I tackle the problem. Here’s a list of things that I have re-consider during that time:

* Type-safety: Maybe for this project it matter less? The output definitely needs to match what the GraphQL schema specified, but the internals don’t have to be. In fact, there are some benefit to not having type-safety, so that there are less ceremonial type cast/check/conversion.

* Framework: Having schema-first with codegen + a billion lines to configure it is probably not what this project needs. Just do a typical resolver-first approach.

* Developer ergonomics: I am still very much in Java-esq-languages-land, and trying to figure out pointers, basically no OOP, and not knowing how to do basic parallelism, means I probably spend more time going the wrong way, run into dead end, and go back and realize what the right approach is. Don’t get me wrong, it’s nice to learn, but it’s not nice to feel like you have accomplish nothing.

![](https://cdn-images-1.medium.com/max/2000/1*sigTjKGJtjmJ0pVJLoqLFg.gif)

So after considering all of the above, I decided to give GraphQL.js a shot. And fast-forward to today, I have already build a lot more of the resolvers comparing to the old one with Go + gqlgen, so I think it’s safe to call it a success (for now).

Don’t get me wrong, **I still really like Go and gqlgen**. It’s just that in this very particular case, **it’s not the right tool for me nor this project**. And on the other side of the spectrum, there are still a lot of things I don’t like about Node.js + JavaScript + GraphQL.js, but most of them are trade-offs that I can deal with (for now).

So what’s the takeaway here?

* Use the right tool for the right job.

* If you have good reasons, don’t be afraid to do some experiment, and even restart what you are working on. It might actually pay off.

* [10x engineers](https://twitter.com/skirani/status/1149302828420067328) are the future of society, and you have to learn how to spot and keep them. [/s](https://www.urbandictionary.com/define.php?term=%2Fs)

And if you are interested in Go/gqlgen/Node.js/JavaScript/Hacker News/this project/GraphQL/basically anything, feel free to leave a comment or reach out to me 🤗
