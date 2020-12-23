---
title: Test
author: Louis Tsai
date: 2019-04-30
hero: ./images/hero.jpg
excerpt: With the growing community interest in Gatsby, we hope to create more resources that make it easier for anyone to grasp the power of this incredible tool.
---
# CLOUDINARY SDK@ANDROID HELL [STORY TIME]

Yup it’s another episode of how I went through hell and somehow come out alive

![Picture of a man successfully configure Cloudinary SDK for Android after 6 hours of trial-and-error (circa. 2017)](https://cdn-images-1.medium.com/max/4096/1*iB0BPa8nV5LN6fvrlg52Og.jpeg)*Picture of a man successfully configure Cloudinary SDK for Android after 6 hours of trial-and-error (circa. 2017)*

I recently implemented the [Cloudinary SDK for Android](https://github.com/cloudinary/cloudinary_android) for my company, and you are not going to believe how much time and energy have been wasted to get it done.

It all started about a month ago, when we decided to add an upload feature to the app. We start digging around, API build a test endpoint so that the uploads are secured, and we try out their SDK. Like any normal human being, I google “cloudinary android”, and the first result is [a folder name cloudinary-android in a cloudinary_java GitHub repository](https://github.com/cloudinary/cloudinary_java/tree/887b0846d9d1402cd9b01cbd1fb88978d048cda0/cloudinary-android). So I digged in and start messing around. After about 2 hours of on-and-off trial and error, I stumble upon another repository call [cloudinary_android](https://github.com/cloudinary/cloudinary_android), and suddenly the whole thing got a lot more confusing. After another 15 minutes I finally saw this line in the [parent folder’s README](https://github.com/cloudinary/cloudinary_java/tree/887b0846d9d1402cd9b01cbd1fb88978d048cda0):
> Note: This readme intended mainly for Web applications. For Android specific instructions, see:……

I understand that for some people might still be using the old version and can’t/don’t want to migrate to the new version, but PLEASE FOR GOD SAKE AT LEAST MAKE SURE IT IS CLEAR THAT THIS IS DEPRECATED IN THE RIGHT PLACE! And the worst thing is that even the [documentation hub](http://cloudinary.com/documentation) on their website points to that stupid folder. I reported that as an [issue](https://github.com/cloudinary/cloudinary_java/issues/109), and thankfully they promptly removed the old folder and change the link on their website to the new repository. So I though that should be the last of it, but turns out I am very wrong…

Fast forward to yesterday: I have been adding all the business logic related to the photo upload feature, and suddenly I found out that I cannot upload the 2nd photo, because the “init” method cannot be call twice. Fair enough, it was written in the [documentation](https://github.com/cloudinary/cloudinary_android#1-unsigned-uploads-using-upload-presets) that it should be called in the “onCreate()”of your application class, I did not pay enough attention. So I follow the instruction and then ran into another problem: now the upload will be rejected. Why? Because now the public_id is out of sync with the Signature (a combination of timestamp, api key and signature string). I keep digging through the documentation and the [sample code](https://github.com/cloudinary/cloudinary_android/tree/master/sample-signed), and it seems that they don’t expect the server side to generate the public_id, but instead expect client to return the public_id back to your backend/however you store your data. Just the process of figuring all of these out took me another 3 hours.

Ok now I know what the problem is, I need to find a solution to the problem of “generating a Signature for the init() method while making sure that Signature is correlated to the public_id that I will pass during the .upload() call”. After severl trial-and-error this is the solution/hack I came up with (with the help of my coworkers):

1. the provideSignature() method takes a Map parameter, and apparently that thing comes from .options(Map) when you upload (if you don’t call that when building the upload request with the builder, the map still exist, it’s just null)

1. provideSignature() can then use the map to generate the Signature object it needs when it is initializing the upload process

1. Make our API call (which returns all the api secrets, public id, etc) in the provideSignature(), and EVERYTHING you want to pass as optinos to the Map param (call .put()/.putAll(), DON’T assign the map a new value)

1. Now when the upload starts, it should trigger provideSignature(), and that gets the secrets and params for both authentication (Signature) and special upload configurations (public_id, folder, etc)

This whole thing only took me another 2 hours. The lack of clear documentation of the specification, useage, and restrictions of their API is so insane it drives me insane. Now I can properly upload multiple photos, hope this helps, and after I finish this sprint (and this rant) I will try to help improve their documentations. I just need to figure out how to convert this rant to something more like an actual documentation!

P.S.: It seems that Cloudinary is known for their shitty/non-existence documentations across platform. I know it is an awesome product but this madness has to stop! Cloudinary if you are listening, please step up your documentation game!
