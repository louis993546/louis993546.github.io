
# Quick Tech Support: Undocumented (mostly QTI) sensors on Android devices

Just trying to figure out what all of these means

I have been playing around with sensors on Android for the last few days, and I turns out there’s a bunch of undocumented sensors, mostly from QTI (seems to be part of Qualcomm). It seems that at some point that is [suppose to be in an SDK, but now that SDK is discontinued](https://developer.qualcomm.com/blog/sensors-and-snapdragon-sdk-early-access), and I can’t seem to find anything that can tell me exactly what they are suppose to do. That’s why I have been toying with all those sensors, and this is what I have figured out so far, and if you have information of the missing pieces, or have more undocumented sensors, comments down below!

1. Facing (type=33171002): values[0] = facing up(1.0f) or down(2.0f)

1. Basic Gesture (type=33171000): values[0] = push(1.0f), pull(2.0f), shake left(3.0f), shake right(4.0f), shake up(5.0), or shake down(6.0)

1. Absolute Motion Detection (type=33171006): values[0] = moving (2.0f) or stationary (1.0f)

1. Tile detector (type=22): values[0] = 1 when a tilt motion has been detected (i.e. you pick up the phone with it’s corner). Not very accurate IMO

These are the 3 sensors that I can figure out. Here’s the rest of the sensors that I still don’t (fully) understand what they represent:

1. Relative Motion Detection(type=33171007): I don’t have a car and I don’t really know how to actually test this right now.

1. Pedometer(type=33171009): It spits out so many data! It returns 16 float every single freaking time! Right now I guess values[0] represents total steps, but it is not increasing incrementally, that’s why I am not certain about it.

1. Motion Acceleration(type=33171011): I think the difference between this and just normal Acceleration is that it only reports when motion is actually being detected, but I haven’t cross check it with ACCELEROMETER just yet.

1. Coarse Motion Classifier(type=33171012): This is definitely the most interesting one: according to [this blog](https://www.qualcomm.com/news/onq/2014/04/24/behind-sixth-sense-smartphones-snapdragon-processor-sensor-engine), it is suppose to be able to distinguish between 7 activities, 7 HUMAN ACTIVITIES. Basically this is the the [Activity Recognition API](https://developers.google.com/location-context/activity-recognition/), but without Google Play Services! It spits out values between 1 and 7 when I am trying it out, but since I am very tied to the computer (which is tied to the desk), I cannot say for certain what those numbers represents. Right now I think 0 or 1 represents resting or sitting, while 6 or 7 represents walking or running. Again, I don’t have a car, so I cannot test the other scenarios.
