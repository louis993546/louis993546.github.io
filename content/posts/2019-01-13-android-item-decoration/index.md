---
title: Test
author: Louis Tsai
date: 2019-04-30
hero: ./images/hero.jpg
excerpt: With the growing community interest in Gatsby, we hope to create more resources that make it easier for anyone to grasp the power of this incredible tool.
---
# From Android zero to kinda-middle: divider/gap between RecyclerView.ViewHolders with ItemDecoration

From Android zero to kinda-middle is a new series, which explores stuff that I have learn in the last 2 years that elevates me from the worst Android developer in the world to “He can be worse”. It will mostly focuses on the little things that don’t get talked about enough, and references to people who actually know what they are talking about.

I don’t have any statistics, but I think it’s pretty safe to say that 95% of apps out there have RecyclerView somewhere in their app. And it’s also pretty safe to say that in at least 80% of cases, there needs to be some kind of divider between items. Sometimes it’s a gray/grey/grah line between items, but nowadays, it’s quite often to just use a blank gap. And the easiest way to do that is just to add layout_margin to 1 side of the ViewHolder and call it a day. While it definitely works, it’s not the most elegant solution, and thanks to the (sometimes ridiculously) flexibility of RecyclerView, there is an API that you can do some “post processing” on each ViewHolder, and it’s call ItemDecoration.
> An ItemDecoration allows the application to add a special drawing and layout offset to specific item views from the adapter’s data set. This can be useful for drawing dividers between items, highlights, visual grouping boundaries and more.
> All ItemDecorations are drawn in the order they were added, before the item views (in [onDraw()](https://developer.android.com/reference/android/support/v7/widget/RecyclerView.ItemDecoration.html#onDraw(android.graphics.Canvas, android.support.v7.widget.RecyclerView, android.support.v7.widget.RecyclerView.State)) and after the items (in [onDrawOver(Canvas, RecyclerView, RecyclerView.State)](https://developer.android.com/reference/android/support/v7/widget/RecyclerView.ItemDecoration.html#onDrawOver(android.graphics.Canvas, android.support.v7.widget.RecyclerView, android.support.v7.widget.RecyclerView.State)).

This is from the [official documentation](https://developer.android.com/reference/android/support/v7/widget/RecyclerView.ItemDecoration), and it’s pretty self-explanatory. And there are also couple of nice resources online that explains how to use it:

* [This one goes much deeper on why the “easy” way is not a good idea](https://proandroiddev.com/itemdecoration-in-android-e18a0692d848)

* [This StackOverflow Q&A tells you exactly how to implements it](https://stackoverflow.com/questions/24618829/how-to-add-dividers-and-spaces-between-items-in-recyclerview)

And IMO, ItemDecoration really shines when it is being used with more complicated LayoutManager: Back in [homify](https://play.google.com/store/apps/details?id=com.online.homify&hl=en_US), one of the minor refactor task that I did was to stop having a ViewHolder to hold 3 ImageView together. Originally, we went the easy way, and create 1 ViewHolder that embed all the margins into the cell, and then the whole list can just use a LinearLayoutManager. But when it comes time to scale it up for tablet and orientation change, that just does not work well, and it adds a lot of boilerplate.

![Originally, each “cell” consists of a wide photo + 2 square photo.](https://cdn-images-1.medium.com/max/2160/1*IOPL68VDhVEl200C0Pjjsw.png)*Originally, each “cell” consists of a wide photo + 2 square photo.*

So the first thing that needs to change is to use GridLayoutManager instead, but then we have to figure out how to add the margin back in correctly. Without ItemDecoration, the 2 square ImageView translates to 2 ViewHolder: 1 with margin embedded on the right, the other one with margin embedded on the left. And because we support RTL languages such as Arabic + support down to API 17 back then, 2 more copies of each ViewHolder exists to add margin to the correct direction. That’s pretty much the definition of boilerplate, and if we use that, at some point people are gonna forget the other configurations exists and break something.

And with ItemDecoration, what we need to do becomes much more logical: The 2 square uses the same ViewHolder, but the Adapter gives it 2 different viewType, so that ItemDecoration can pick that up, and add the margin in the correct direction. All the LTR & RTL logic is also encapsulated in the ItemDecoration itself (it just need Context. It’s not ideal, but IMO there are a lot of other stuff that’s worse in the code base anyway), so that we don’t have to stare at those verbose code everyday.

Again, if you have any questions, feedback, etc., leave a comment down below. I’d really appreciate it!
