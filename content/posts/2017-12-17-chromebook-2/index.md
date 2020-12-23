---
title: Test
author: Louis Tsai
date: 2019-04-30
hero: ./images/hero.jpg
excerpt: With the growing community interest in Gatsby, we hope to create more resources that make it easier for anyone to grasp the power of this incredible tool.
---
# Life with Chromebook ep. 2: first 25 days

Sunday afteroon, typing this article in a local Starbucks

In the last article, I said that I will probably write a follow up article in a few days. And 25 days later, I finally get my shit together to write this article. My laziness definitely play a role in it, but before I dive deep into that, I probably need to do some follow-up and more basics.

## How’s the hardware holding up?

It has only been 25 days, and unsurprisingly it is still doing fine. In fact, it actually feels better because I am more used to the quirks and stuff: the screen is more acceptable with the right brightness, and the trackpad actually feels good enough after I am used to the weird texture a bit more. And after dozens of times of outing with this device, I am happy to report that the battery life of this thing is very good. I didn’t do any measurements that is even remotely scientific, but just from a day to day experience, I can tell you that it can easily last a day of research, browsing, music, and more.

## Any surprises?

As a matter of fact, yes! So as I mentioned in the last article, this thing has a ARM SoC from Rockchip and 2GB of RAM, which is definitely not gonna win any award in late 2017. But the weird (and surprising) thing about this machine it that it perform better than I expected in some tasks, while basically crash and burn in some tasks that I though it might be able to handle.

What I expect it to perform badly but doesn’t: multitasking. I though the 2GB of RAM will heavily limited it ability to run more than 5 tabs at once, but it actually does pretty well (as long as those tabs aren’t doing anything crazy in the background). Right now I am in job hunting mode, and I constantly have dozens of tabs open on different positions, professional social networks, some of my portfolios open, and Spotify playing some random music in the background. You can definitely tell when it is trying to retrieve the cache from disk or refresh the page, but it is usually fast enough and make the experience pretty smooth.

What I expect it to be able to do but doesn’t: just basic image editing. When I start writing this piece, I took out my Sony a6000 to snap a picture of my setup as the cover photo of this article. When I try to open the photo to do a minor angle adjustment(which it can’t), it just straight up crash and burn. The whole machine just straight up froze for like a minute, and when I am able to move the cursor around again I just close the gallery app and wait for machine to go back to a normal state for another minute. After that, I went back to the browser tabs and find 6/15 tabs just went down. I end up sending the photo to my Nextbit Robin and use Snapseed to do that.

![6/15 tabs just gave up after the torture (and I used one of the tab to search how to take a screenshot)](https://cdn-images-1.medium.com/max/2732/1*T9JMEl7-OSJzt-xbyuty3A.png)*6/15 tabs just gave up after the torture (and I used one of the tab to search how to take a screenshot)*

This experience tells me 2 things:

A) without Android apps Chrome OS is still very limited. For example, the build-in gallery app can only rotate photos 90/180/270 degrees, and most of the free online photo editing website are just bad (esp. in terms of UX)

B) The SoC + Chrome OS is REALLY slow. I don’t have my old phones right now, but I swear my old Nexus 5 or even Nexus 4 can do without melt down. I don’t know if it is because the SoC is just being slow, or using (probably) JavaScript to do image rotation is just a bad idea, or a mixture of both.

## How about Chrome OS? Any new insights?

Now back to the thing I mentioned in the intro: why it took me 25 days instead of the few days I expected to get this article out. In the last few week, I have been busy on a lot of other stuff, most of them are related to my programming side projects, mostly about Android apps. And after some digging, I realized that it is basically impossible to do any meaningful work with an ARM Chromebook, which means I spend much less time on this device than I have expected. Even if I get chroot to run on this device, I won’t be able to get Android Studio to run normally on this machine, and as a junior developer on basically every field that I am interested in (Android, Backend with Golang or Java/Kotlin, ML, etc), I really need help from IDE to make me productive.

From the very beginning I know that doing any kind of development work on this machine will be very hard, but it is actually even more restricted than I have ever imagine. I even tried all sorts of online alternatives, from Eclipse Che (by Codenvy) for development, to Figma for design work, but neither of them are intuitive enough (yet) to replace or even just complement my current workflow. Hell, even just finding a acceptable text editor on Chrome OS is hard, and I end up just staying with the build in “Text” app and use it as markdown editor.

And after the recent announcement of Chrome Apps are going away for most platforms and embracing Progressive Web Apps, it is pretty clear that even Google aren’t really sure how to take Chrome OS out from classroom to the real world. They have been trying to get developers to make Chrome OS specific apps, which fails, then they try to get Android apps to work on Chrome OS, which definitely helps, but then they remember that basically no apps are optimized for tablets, let alone Chrome OS (keyboard + trackpad + usually no touch screen). So the issue still remains: only people in the education market can find Chrome OS suitable for their day to day life, and basically after high school, Chrome OS has no place to stand.

Just like all the other (failed) OS, Chrome OS has the same chicken and egg problem that it cannot escape from: people don’t get Chrome OS devices because the restrictions on what it can do with the software, and developers and companies do not developer software optimized for Chrome OS because no one (other than the education market) are using Chrome OS devices. So many companies have tried to throw money to escape this downward spiral, including [Microsoft](https://www.theverge.com/2013/6/15/4433082/microsoft-paying-companies-100k-windows-phone-apps), [Samsung](https://www.theinquirer.net/inquirer/news/2477150/samsung-really-really-wants-developers-to-build-tizen-apps), [RIM(Blackberry)](http://www.zdnet.com/article/rim-pays-developers-500000-to-build-apps-for-blackberry-10/), even back to the days of [Palm](https://techcrunch.com/2010/06/29/palm-pays-developers-to-create-applications/), and obviously all of them failed. The education market is Chrome OS’s first, only, and last hope, and I am not sure how long it will last, especially when [both Apple and Microsoft are fighting back with cheaper hardware and better management software](https://techcrunch.com/2017/04/27/as-chromebook-sales-soar-in-schools-apple-and-microsoft-fight-back/). One misstep and Chrome OS will be DOA. On the top of my head, here are several of the industries that I think Chrome OS have potential to tap into (2017 edition):

* Developer (except mobile developer) market. Most things run on the cloud now, someone just need to figure out how to move the heavy part the development environment to the cloud, while leaving low-latency components to the device and make it basically a thin client, developers should be able to embrace it.

* Sales. While working in my first full time job, I have a chance to see how salespeople work, and most of their job does not have any dependencies on Windows/macOS/Linux, since all they were using were VoIP + Salesforce + Browser + Internal communication (in this case Skype and Gmail) + Spreadsheets. I honestly don’t know what is preventing companies to use Chrome OS devices except for habbits.

I also wrote [the same thing about 1.5 years ago](https://medium.com/@louis993546/tl-dr-chromebooks-are-awesome-38b7aa2bab47), if you are interest you can also take a look and let me know what you think in the comments down below.

## What next?

For me, the device will stay with me for the foreseeable future, and I will keep using it for all the non-development-related tasks, especially when I am in the mood of working outside, since it just feels better to carry a device that is design to be fine if it got stolen or destroyed.

For Google, I think they really need to get Android apps to [all of the scheduled devices](http://chromium.org/chromium-os/chrome-os-systems-supporting-android-apps) ASAP. Right now there are only 2 devices with Android app support on the Beta channel, while about 3 months ago there are always dozens of devices in development. Introducing Android apps to existing Chrome OS devices should be able to buy them some time and reduce the amount of people jump back out to the world of proper desktop OS for now. Meanwhile the management and the business side of the company needs to find another industry that can and will embrace Chrome OS.
