---
title: Test
author: Louis Tsai
date: 2019-04-30
hero: ./images/hero.jpg
excerpt: With the growing community interest in Gatsby, we hope to create more resources that make it easier for anyone to grasp the power of this incredible tool.
---
# ANALYTICS HELL [STORY TIME]

Picture of a man strugging to figure out how to fix the analytics (circa. 2017)

This is a tale of how I got myself into a hell of analytics refactoring

## Background

It all started about 5 months ago: I have been working in this company for about 3 months, but I am still new to a lot of things because it is my first full-time job. I don’t really know about agile and sprint (although that is actually not that big of an issue since that has been the 28th week of a sprint -_-); my programming skiils are not particularly sharp since I have been kind of out of practice because of all the job hunting; and I am still adapting to all the new things associated with this new job: moving to a new country, trying to learn German, learning more stuff about the city, etc.

One day a new ticket arrive, and it is about analytics. The other Android developer took it, and another developer in the iOS team has the same requirement but different ticket, nothing special. Fast forward to 2 months back: after the official launch of the app, we realised that the 2 analytics are not matching AT ALL. Things are common include

* Both are on Firebase Analytics (now known as Google Analytics for Firebase)

* Both use level_up event to track page scroll

That’s it. There are a list of things that needs to be tracked from the product owners, but what end up happening is that the 2 developers just track what they think is right in the way they wanted. How did this happen?

## Cause

Well there are a whole chain of events that lead to this, but in my eyes these are the most important reasons why this happens:

1.Stubborn developers refuse to work with each other

For whatever reason the 2 developers are the 2 most stubbon people I have ever met. They don’t hate each other, but if you ask them to work together it immediately feels like mixing oil and water. They both have super strong opinions, and from my personal experience interacting with them (in other issues), they are not going to back down no matter what. They are both nice people, but they just don’t work together at all.

2.Specification never clearly define

I am not going to go through the whole business of the company of how it started, all you need to know is that the analytics we collect are rarely used. We know that data-driven decision making is the future, but right now we are barely using any of those data. And since there isn’t any real goal of that the business side wants to track, the specification of what needs to be track and why are also not clear. We end up having generic descriptions of what needs to be track and thats all.

## Solution

Right now we don’t really have a solution, since most of the time those analytics are not being touch unless someone from high up ask for it. And last time it happend I ended up spenging a whole week writing down a documentations of what is being track right now across the two platform, so that if a clearer analytics specification never arrive (which is probably what is happening), someone can still use the document to find out some useful information.

In long term, pretty much all the analytics event needs to be clearly define and implemented, and we (developers, product owners, business people) need to work together to help drive the company to be more data-driven. But as a junior developer, I don’t really have much control to that, and even though pretty much everyone knows it’s basically a dumpster fire, only very few people care about it.
