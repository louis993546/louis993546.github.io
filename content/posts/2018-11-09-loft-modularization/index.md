
# Loft: How I modularize my Android app*

4 nice and simple module

Loft is a whole system that I’m working on, with a goal of simplifying a lot of little things when living in a share flat, especially applicable when your landlord decides who move in or not. Right now I am planning to have an [Android app](https://github.com/louistsaitszho/Loft-Android), [iOS app](https://github.com/louistsaitszho/Loft-iOS), and [API](https://github.com/louistsaitszho/Loft-API) to support it, nothing to special. While all the documentations is/will/should be embedded into the git repository itself IMO, I would like to also share things that I learn along the way, but in an easier to consume format, and that’s why I am creating this series.

**: This app is still in early state, none of the features are even close to complete, which makes the modularization a lot easier than basically everything else. So keep that in mind.*

If you went to any Android conference this year, you will probably know that modularization is pretty popular. Apps are getting bigger, build time are going from *mission impossible, to mission* of *freakin*’ *insanity. *If you don’t know what it is, just Google or YouTube “android modular”, and you will find a lot of great content. And with App Bundle and the ability to finally dynamically deliver features in platform languages, more and more developers are putting modularization high in their priority list. And in the last week or so, I finally got it working in loft, and now I’m going to tell you all the details that it takes to get there.

## Structure

![The structure of loft right now](https://cdn-images-1.medium.com/max/2048/1*bKwQ6VUnL6-zGpjKpWW8Dg.jpeg)*The structure of loft right now*

Just like everyone else, when you create an app with Android Studio, it creates the app module that has everything. So the first thing I did was plan out how I want to split things up, obviously. I know that a lot of the apps keeps features completely separate, but right now it’s not a very good approach for me because I am using the Navigation library from the Architecture Component. Yes, [there’s a way to make cross-module navigation work](https://blog.usejournal.com/multi-module-navigation-with-the-android-architecture-component-82ed028fa1d9), but loft don’t have a complex flow, and I don’t want to spend way too much time writing wrapper, hacks, workarounds just to get it working. I am totally fine keeping the navigation graph in the app module.

![That’s all the nodes in my graph (because most things are in the ViewPager in mainFragment)](https://cdn-images-1.medium.com/max/2924/1*RCxjvICv0SVRU3QIykwxAg.png)*That’s all the nodes in my graph (because most things are in the ViewPager in mainFragment)*

So the (only) feature that makes sense to be modularize right now is the onboarding flow. It is mostly just a bunch of views to explains what loft is, and then at the end a flow to create a loft or join a loft via the API, and save that data locally. And in order to be able to access the API code and local storage code from both app and onboarding, I have to move them out into a module that both of them can depend on, and they become common and api. At some point there will probably be at least a localStorage module, it’s just that right now it only has 1 method to access the SharedPreference, so I will do that later when I introduce database to loft.

To get started on creating a new module (it’s call “Android Library” in the GUI), it’s fairly simple with all the GUI in Android Studio. However, the code that it generates is actually not that great, and it’s surprisingly hard to find out how to actually connect modules together (quite a lot of conflicting answers on StackOverflow!?). So here’s some of the things that I have encounter:

### Synchronize min/compile/target SDK version with ext in the project build script

<iframe src="https://medium.com/media/4fa572ae93af68380e8fe2a3d50e20bd" frameborder=0></iframe>

For this project, I don’t care about reusability of each modules at all. I just want to prevent the build time from going crazy. This whole project is going to stay together forever, get build together forever, so it makes the most sense to keep all of the SDK version in sync to avoid spending hours debugging different behavior in different SDK versions.

### Delegate navigation with the old & outdated but works well onAttach(context: Context)

<iframe src="https://medium.com/media/b8dd50295b9453e3ff550440d02d39e3" frameborder=0></iframe>

Using onAttach to get the fragment to talk to it’s Activity is not the nicest thing, and I know that. However, I don’t know the onboarding module to have reference back to the app module, so this is the best solution I have so far. If you have any idea how to improve this, please let me know!

**Update: I totally forgot about configuration change. When you rotate the device, the activity gets destroy, but the fragment survives it. So you have to remove the reference to the activity, i.e. navigationDelegate = null when onDetach(), which means navigationDelegate becomes just a nullable var.**

The NavigationDelegate is just a very simple interface that allows the fragment to trigger the activity to call findNavController(resId).navigate(action).

<iframe src="https://medium.com/media/b724dbac54ab79d8de67b112e1848024" frameborder=0></iframe>

And if you want to add 100% type safety, instead of 1 method, just create 1 for each possible combination of from and to with the data and the data type in the method. Just pick whatever works best for you.

**Update: I ended up moving from ”from enum to enum” to “transitions sealed class”**

<iframe src="https://medium.com/media/ae10ed5b2201f437b9e5c389bc9e5c0c" frameborder=0></iframe>

**This makes the code a lot more readable on the other end**

<iframe src="https://medium.com/media/22404d3592d89d76f47e723b21a6bc06" frameborder=0></iframe>

**The compiler also knows how many possible outcomes there could be, and warn you if you missed any of them, so that’s very nice! And it also makes passing type safe parameters a lot easier, but it’s not shown here since those transitions don’t need them right now.**

### Remember to move all the resources to the right place

When you forgot to move resources (style, string, drawable, etc), the runtime error that it cause is not helpful at all. It basically just tells you when inflating the activity, it goes wrong during NavHostFragment inflation. So go to diff, go through all the files that has moved, and Android Studio should be smart enough to red you with all the resources that you forgot to move. Just make sure you move it to the right module.

### Don’t forget to add the dependencies between modules into the appropriate build script

It took me way to long to realize why app module has no access to fragments in onboarding, and why onboarding has no access to NavigationDelegate in common 😑

<iframe src="https://medium.com/media/51bcfd84d771acd87bdb33d091eb506e" frameborder=0></iframe>

### As of today, parallel gradle build is still not official, so remember to turn it on to get the benefits in gradle.properties

<iframe src="https://medium.com/media/d4e757b89c674eb557a017527c3f9054" frameborder=0></iframe>

Again, this is not a comprehensive guide in any way, shape, or form. So go back to Google, and find other resources. Happy modularizing!
