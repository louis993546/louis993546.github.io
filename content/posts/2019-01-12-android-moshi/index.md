
# From Android zero to kinda-middle: Parsing JSON with Moshi

From Android zero to kinda-middle is a new series, which explores stuff that I have learn in the last 2 years that elevates me from the worst Android developer in the world to “He can be worse”. It will mostly focuses on the little things that don’t get talked about enough, and references to people who actually know what they are talking about.

When you first start using square/retrofit, there is a 99% chance that you were (probably still) using google/gson. It’s in every entry level documentation, and it works more than good enough to get the job done. But it’s 2019 now, and better JSON libraries exists now, and today I’d like to talk about square/moshi.

Like it’s name suggests, [Moshi comes from Square](https://github.com/square/moshi), and I think I first heard from it in droidcon Berlin 2017

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/u0uQL5obBsM" frameborder="0" allowfullscreen></iframe></center>

Apparently gson’s development halt for quite a while, and there are some badly design API’s and behaviours that bite me in the ass when you least expected. [Moshi is essentially the gson 3 that never happened.](https://www.reddit.com/r/androiddev/comments/684flw/why_use_moshi_over_gson/) And in my personal experience, this is why I switched to Moshi:

1. Not well documented default parsing behaviour, most notably java.util.Date

1. Custom type adapter is harder to figure out than it should be

1. **Reflection based= does not work well with Kotlin**

While (almost) every single json parser are reflection based, earlier this year, [Moshi gains the ability to do code generation instead](https://medium.com/@sweers/exploring-moshis-kotlin-code-gen-dec09d72de5e), and it’s amazing! The problem of reflection + kotlin is that a lot of “type checking”, “null safety”, “default value” feature are actually just adding if not null by the kotlin compiler, and all of the reflection-based tools essentially skipped those rules. It also poses some runtime performance penalty. (For most people, it wouldn’t be the biggest performance issue, but still)

What Moshi codegen does is exactly what is sounds like: it generate code in compile time, which understands all the kotlin syntax and rules. It does mean it does take some time to generate code in compile time, because there is no free lunch in the world, someone will have to parse the json at the end. In my experience, the process is not slow enough to be noticeable, so that’s nice 👍.

According to [this benchmark](https://github.com/fabienrenaud/java-json-benchmark), Moshi’s runtime performance right now is more or less the same as gson. Meanwhile, it has very good documentation, for example, what exactly can it parse, and what would the defaults be. It is also very easy to add adapter to “teach” moshi how to parse data directly into custom data type, which is awesome for stuff like UUID, OffsetDateTime, and whatever weird ternary that your API is sending.

And if you want to try it out, just read the [repositories’ README](https://github.com/square/moshi). It’s very detailed, and it gives you a much better understanding on what Moshi does, and even just how json parsing works in general!

Whether you like it or not, I’d really like to know what you think. What you like, what you don’t, leave a comments down below!
