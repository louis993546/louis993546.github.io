---
title: Living in a country where internet is usually slow and unreliable
author: Louis Tsai
date: 2016-01-18
excerpt: Something
---
# Living in a country where internet is usually slow and unreliable

It’s actually not too bad when everything works.

For the last 9 days I have been living in Phnom Penh, Cambodia with an NGO to work on my final year project: a medical record system suitable for mobile clinic. The reason why they don’t just use Google Doc or something is because of the fact that internet access is not stable and fast enough to handle the amount of data. And for the last 9 days I have been experiencing just that.

Before I arrived Phnom Penh, they already told me that the internet is not stable, even in the place I stay. But for the first 24 hours, I have practically no internet access: I have managed to received WhatsApp once, and when I try to text back, it doesn’t get delivered. That’s how bad it is. A day later my friend get me a SIM card and some data (Thank you Channat), and I was finally able to at least text my family myselves. Even when I am using the mobile network, I experience jumping between 3G and 2G, which is basically unuseable for most mobile app, more often then I’ve expected when traveling in the city. And in the office hour, when a bunch of people each having at least 1 piece of gadget that connects to the Wi-Fi, plus the dozens of residents living in the same building, the internet speed is also unbearable.

That’s the thing: internet is not only slow here but also not reliable to get anything done. That’s part of the reason why the NGO I’m working for stick with pen and paper for a lot of the tasks, because cloud computing is not feasible. That’s why me and my team have been working on a medical record solution for them to access those data when internet is not suitable, while avoiding the cons of having 5 super thick binders full of patient records.

For the last 8 months I have been working with “Student Inovation for Global health technology”, also known as SIGHT from HKUST. Last year they have developed a medical record system as well, but the product is not suitable for actual daily operation, due to the issues in the medication part and the lack of useable hardwares, because their solution requires computers (for those who knows programming: Java w/JavaFX based app + a computer running Apache + MySQL). As the result, this year we start from scratch, building basically the same product but with completely differently technology, on completely different platforms.

Firstly, instead of computers, they will be able to use their iOS and Android devices to run our Swift and Java based application respectively. Secondly, the server side will a Raspberry Pi 2 Model B instead of a actual computer to make it easier to carry and easier to operate (since there will be nothing but an on-off switch on the hardware). And instead of just having a MySQL running, the server side will have a node.js app to make sure only people with permissions will have the ability to tap into the system.

If you want to know more about what we been working on, go check out our GitHub page and repositories [here](http://hkust1516csefyp43.github.io) and [here](https://github.com/hkust1516csefyp43/). Every project is completely open source, because we hope that not only the NGO we are working with a.k.a. [One-2-One](http://one2oneworld.org) will have access to this software, but also whoever finds it useful. If you want to know more about SIGHT, click [here](http://sight.ust.hk).
