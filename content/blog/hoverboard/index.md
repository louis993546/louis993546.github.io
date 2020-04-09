---
title: "A Quick Review of Project Hoverboard"
date: "2019-11-13T09:19:52"
description: "TL;DR: Project Hoverboard is great, but not perfect for smaller events?"
---

![](https://cdn-images-1.medium.com/max/1024/1*wK6GttdsHUMYcoQVfXpY0w.jpeg)<figcaption>I made\* this</figcaption>

So for the last few weeks, I have been helping out with [DevFest Berlin 2019](https://2019.devfest-berlin.de/), which just happened last Saturday. From [what I can tell](https://twitter.com/search?q=%23DevFest19%20%23devfestBerlin&src=typed_query), people really enjoyed the event, which is definitely the most important thing. For that, I have to **thank everyone who attended, all the speakers who share their knowledge, and, and most importantly the other volunteers and organizers for making this possible!** And as a volunteer, one of my biggest contributions would be “building” and maintaining the website. The reason why I put double quotes around the word _building_ is because instead of making a website from scratch, I use another project as the template, and that would be [Project Hoverboard](https://github.com/gdg-x/hoverboard).

The first thing I want to say is **Thank you to the amazing people from GDG Lviv for making this!!!** 😘😘😘. It allows us to quickly serve up a beautiful, offline-compatible, accessible, and effective website. I cannot stress that enough! Now that the compliments are out of the way, let’s jump into what I think about it, who is a (terrible) Android developer that is constantly trying to learn new things 🤷‍♀️

### Pros

#### Amazing demo

So what’s the best way to let people know what your template is about? Well, a fully functional, fill to the brim, performant, and beautiful “demo” site is definitely gonna do the trick 🤯

#### Amazing Documentations

Like seriously just look at the README! It’s so detailed, and I got something started in a matter of minutes!!!

#### Accessibility 👍

While I never really tested the accessibility part, it’s really nice that they have it in mind, especially when inclusivity is a big part of DevFest Berlin this year. Special shout out to the organizers and selection committee for having such a diverse panel, which include [this amazing talk from Franziska Hauck](https://twitter.com/_francied/status/1193240010780299265)!

#### PWA 👍

This is particularly useful when the venue Wi-Fi is overwhelmed……

#### Secure 🔒 👍

The last thing you want is to have a tech(-ish) conference website to leak a bunch of info, or have loopholes that allow bad players to inject malicious data. From my very limited knowledge of the npm ecosystem, it looks like the project is pretty secure. Not perfect, but more than enough.

### Cons (mostly nitpicking)

#### Firebase functions errors are not obvious

One of the “bug” that takes me forever to figure out is that apparently, you should not pass an empty array to the socials of speakers (if I remember correctly), and if you do that, the firebase function that transforms speakers JSON will fail. And since it’s happening on the cloud, it took me forever to realize how to find out the “Health” of those functions, and slowly figure out what I have done wrong. It’s particularly bad because of the strict pre-commit hook, that gave me the impression “oh it pass lint locally, so the formatting must have been fine”

#### Import script is somewhat basic

Another issue I faced is how to import everything once the schedule is done. Before it’s ready, I added a bunch of dummy schedule & speaker placeholder, so that people can understand “oh the schedule is not ready yet”. And once the info starts flowing in, I run the import script, and realized that “oh, all those dummy sessions are still on firebase, because the firebase function does not do removal”. It’s not a deal-breaker, I can just remove everything from firebase database, and let it import everything again.

#### No easy way to integrate with CfP platforms

Continuing on the data import topic: for the first batch of import, it will probably come from some CfP platform like Sessionize or PaperCall, and currently, there is no easy way to transform the output from those platforms to the input of Project Hoverboard. I ended up botch a [simple script](https://github.com/louistsaitszho/PaperCall-to-Hoverboard) to handle the conversion, but it feels like it should have been part of the documentation to say the least 🤷‍♀

#### ➡️ Missing CMS part of the project

All the previous points can kinda be summarized as “not having a CMS”. Like it or not, event organization is often chaotic: last-minute speaker change, ticket sales open and close, people request to have their info change, missing pictures, the list can go on forever. And having some type of CMS, or at the very least, centralize all content into 1 place, would make it a lot easier for us to maintain.

#### Somewhat obscure tech stack

From what I understand, the world of websites is either build with PHP, or with React. And for this project, the use of Polymer (or web component I suppose?) and “50% data static + 50% data on firebase” is unconventional to say the least. And as someone who wants to learn more about frontend development, I wish I could have learned something more popular/hyped, like using JAM stack + static website generator.

#### Overkill architecture & features

**This is quite specific to this particular event** : the architecture is a bit too complicated. Having data split in 2 places makes it hard to maintain, and easy to forgot to deploy something, or worse, deploy something that shouldn’t have been.

And similarly, there are also a few features that’re quite unnecessary for events in this scale, like:

- SSO with facebook, twitter, or Google for push notification. There are only 2 tracks, you don’t need notification to tell you “hey everyone is moving”
- Link to previous speakers. It would probably be more useful to just link to the site from the past, so that users can have a bit more context on what it was about.
- Analytics. For 250-ish attendee events, this is not necessary. I ended up manually removing all references to analytics from the codebase. It’s not hard, but it is probably not necessary for most events.

So what have we learned today?

1. The people from GDG Lviv is amazing!
2. Everyone attended/spoke/organized/helped DevFest Berlin 2019 is also amazing!
3. Project Hoverboard saves me so much time
4. DevFest can range from “having dozens of people” to “multi-day multi-track extravaganza”, and that translates to very different needs for the website
5. “Ease of use” is important for both attendees and website maintainer
6. etc.

And this is my quick review of Project Hoverboard, and now that I have written things down, I started to get motivated to build my own version of “a small-ish conference website”. Let see how it goes……

![Group photo of DevFest Berlin 2019](https://cdn-images-1.medium.com/max/1024/1*Vxp0cjo4CYC11ALUg0gp2A.jpeg)<figcaption>🙌 It shouldn’t be hard to spot me 😝 (Credit: <a href="https://www.kimlahav.com/">kimlahav.com</a>)</figcaption>
