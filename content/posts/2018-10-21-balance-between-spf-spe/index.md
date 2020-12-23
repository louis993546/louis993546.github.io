---
title: Test
author: Louis Tsai
date: 2019-04-30
hero: ./images/hero.jpg
excerpt: With the growing community interest in Gatsby, we hope to create more resources that make it easier for anyone to grasp the power of this incredible tool.
---
# Finding a balance between “Single point of failure” and “Single point of entry”?

I was browsing my RSS feed (when I should be working on my React.js project that I promised my friends that it would have been done more than a month ago) and I run into this article about what YouTube went down taught us. And it remind me that as a programmer working (primarily) for startups, I often find myself saying the following basically opposite statements:

1. Having just 1 person knowing something important/complex/both is dangerous because it creates a single point of failure. What if he/she got into a car accident one day?

1. XXX architecture/design pattern/having a coordinator is a good idea because it creates a single point of entry that is easy to debug/have limited amount of side effects/makes it easy to keep track of everyone’s progress and coordinate tasks accordingly

While I think both statements are valid in their context, there is no denying that there is definitely a degree of contradiction between the 2. And now I will try to string together a series of “guidelines” that help you decide which statement applies to your situation. Obviously the TL;DR answer is “It depends”, but I am just hoping that after you read this there will be less criterias that you missed.

Oh and why did I quote the word “guidelines”? Because I just though of this and I am just dumping out what’s in my head with little to no organizations. I just want to get this out of my head. So put on your seat belt, here’s a bumpy ride!

P.S.: SPF = Single point of Failure, SPE = Single point of entry

## If it is about coordinating tasks (for human), cons of SPF > pros of SPE (probably)

One of the problem that I have seen happened the most is that “Oh we are not working efficiently as a team, maybe we should just hire/assign a person to get it all sorted out”. And how often does it work out? Almost never. Coordinating a group of people is a very challenging and time consuming task, mostly because each pair of people has their way of communication. The time and effort it takes for the coordinator to figure out most of the communication channel and methods is already a challenge of it own. But IMO the biggest problem of this kind of thinking is that it kind of ignores the root of the problem, which is communication.

Think about it: why aren’t things running smoothly? Why that team of developer end up having to spend 2 days to rewrite the part of code they completed last week? Why 2 people were working on the same tasks for a day before either of them figured it out? It’s the communication between all of the people involved. If you have developers that don’t want to/too shy to talk to other people, how is having a coordinator gonna help? Unless they are a literal robot that only does what the coordinator told him/her to do, they are probably gonna work on stuff and did not told anyone else until it’s too late. If you have developer that is being hostile and just an asshole in general, how is having a coordinator going to help if they are just gonna ignore the tasks/assignments/instructions?

IMO, coordinators are suitable when there are too many pairings of communications (e.g. if there are 10 people, it means each person can talk 9 other people, and if there are 100 people, it goes to 99). In that case, the coordinator task would be to help consolidate the communications so that each person don’t have 99 channels of communication that might happen any second. Basically you will be trading off efficiency of some of the individual communications for the average efficiency of all the communications, but you already know that.

## If you are a high level non-manager, pros of SPE might > cons of SPF

In the last section I just rant how SPE does not solve the problem of bad communication, but immediately following that I am going to talk about how in some cases it might not be true. In a company, there are usually several people that are in charge of making high level decisions, because if every single decisions are based on democratic rules, things will rarely get done. Just look at virtually every single government out there. And for those people, what makes it special is that you have more important responsibility, and communication kinda becomes something that might be worth outsourcing. Humans are not robot, we can’t run 24*7 no matter how hard we tried, and we can never perform consistently. Basically our brain power is a limited resources (that can be recharge but takes some time), and if you push yourself past that limit, there’s got to be sacrifice to be made.

In my experience, an over-stuffed boss can easily become a SPF, and cascade into a series of other issues. Whenever we have problems, the boss won’t have the time/energy to get it sorted out, which end up blocking our progress, which in turn blocks the progress of our work, and it all goes back to delaying the original plan that the boss has planned out. In those cases, since the bottleneck of high efficiency is at high level, the most logical solution is to delegate some of the tasks to someone else. Yes they might not do such a good job, but at least they will be able to get it done. Unless you are making LITERALLY world altering project, you can probably go back to polish it afterwards. You can polish shit (which is a weird thing that people do on the internet BTW), but you can’t polish nothing. Having a small number of communication channel (close to SPE of communications) is one of the most effective way to get your time and energy back.

The TL;DR of this section is “Prioritize is important because you are not a robot, and having single/very few point of entry of communication is a very effective way to get a huge chunk of your time and energy back”

## In the context of programming and coding (and a lot of engineering), the risk of SPF is surprisingly low because people usually see it from a mile away

As I steadily become a better programmer (not a good programmer by any mean, just better that my old self), I often have to decide how I will implement things, including how to control the flow of data/information/signal/whatever it should be call in it’s context. And after a series of trial and error, plus a lot of reading on the internet, I am much more comfortable of SPE, and less afraid of SPF, and I think the reason is that as long as the planning is sufficient a lot of SPF scenarios can be minimized relatively easily.

Unlike making plans for human, making plans for code is usually less complicated, because they do exactly what the code instruct it to do, i.e. there is less ambiguity and most human will have similar if not the same understanding of a decent quality code. They don’t know how to be sarcastic (yet), they don’t know how to clap back(yet), and they don’t know how to obey instructions (yet). As long as the plan is not too convoluted, you will probably be able to spot all the potential SPF and the scenario of how failure can happen, and do something about it beforehand. For example, the “Football” that can launch nuclear weapon, easily a SPF, and the people who built it includes a whole suite of safety measures; In civil engineering, they included a large safety factor into a lot of the components, especially load bearing structures, because we can all foresee what would happen if those structures fail; and in the age of only a handful of company having a huge control of the internet and the data in it, a lot of large scale project exist to create backup of the content to prepare for the downfall of them. They are far from perfect, and there are definitely a number of cases to demonstrate that. On the top of my head:

* The YouTube went down fiasco that spawn this whole article

* Hawaii missile false alarm from last year

* [This article of how (remote control) feature flags can screw up everything](https://www.infoq.com/articles/feature-flags-gone-wrong)

* Numerous data leak (Just go to [Have I been Pawned](https://haveibeenpwned.com/) and you will see how often those things happen)

None of these are a good thing, it’s just that when you compare it to the scale of the internet, how fast it is moving, how many traffic are on it every second, it shows that we have build a decent amount of safety net. Ultimately my point is that when it comes to software, coding, and sometime engineering in general, we are a lot more equipped to deal with a single point of failure than most things happening in real world.

I think it’s been almost an hour since I started writing this, and at this point I think I should pause for a second and thing about it through in a later time. I am not going to proof read this, and please don’t take it as the ultimate guide to finding balance between SPE and SPF. And if there is anything that you think I am wrong, please let me know. I am a big believer in constructive criticism and healthy discussion, mostly because I have had a fair share of toxic “everything is awesome” atmosphere, but that’s topic for another day!
