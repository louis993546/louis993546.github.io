
# Mental Models of Jetpack Compose #2: Declarative UI (with code) & separation of concerns

Separation. Photo by Jamie Street on Unsplash

In the [last chapter](https://medium.com/@louis993546/mental-models-of-jetpack-compose-1-state-programming-models-cc0d47209720), we looked at 2 mental models: “state”, and “programming models”. And now, let’s take it 1 step further and see how declarative model translated to the world of UI development. 🌀

## Declarative UI (and the spectrum of it)

Even when the goal went from “describing the process of building a house 🏠 ”(imperative) to “describe the house 🏠”(declarative), there are still a lot of different ways to “describe the house 🏠”. You can make a CAD, you can sketch it out on pen and paper, or you can write a 200 page descriptions of every single texture, material, and color of every single wall. And in my opinion, it is more or less the same story for declaring UI. There are a lot of different solutions, and the amount of flexibility you have is one of the most obvious different between them:

### The static kind of declarative UI

Basically most if not all markup languages (e.g. XML, HTML) are in this category. In those languages, there is not much you can do, other than laying out existing “components” or “tags” or “whatever you want to call it”. If you want to do pretty much anything else, you will have to go back to imperative-programming-land.

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="vertical">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Hello, World!" />

    </LinearLayout>

### Less static kind of declarative UI

While XML is not the most human-friendly syntax, it’s still far from “terrible to read” or anything. And if it is still understandable, what if we just add a few extra feature on top of it? Introducing data binding, officially introduced to Android Developer back in 2015.

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/5sCQjeGoE7M" frameborder="0" allowfullscreen></iframe></center>

It is still very much based on all the existing syntaxes, along with all the XML skills developers have build up over the years. It basically just introduce a series of basic imperative programming tools, and makes it a lot easier to keep more of the “concern of the UI” in the XML itself.

    ...

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@{viewmodel.userName}" />  // <- tada 🎩

    ...

### A really dynamic kind of declarative UI

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/GW0rj4sNH2w" frameborder="0" allowfullscreen></iframe></center>

And just 2 years before that, in the world of web development, a little project call [React.js](https://reactjs.org/) got open-sourced by facebook, and while the early responses was not exactly stellar, it doesn’t take long before the industry adopts it in a very rapid pace. And not just React itself, similar frameworks also started to pop up and got adopted by the industry: Vue.js, Angular, and later to the world of Android (and iOS) with React Native, Anko, Litho, and more recently Flutter. So what makes it special?

    class Hello extends React.Component {  
        render() {  
            return <h1>Hello world!</h1>;  
        }  
    }

While data binding introduces logic into a markup language, React does the opposite, by introducing markup language into a imperative programming language. While that might sound counter-intuitive (if the goal is to encourage declarative code, why would we make it so easy to write imperative code!?), the reality is that making a generic declarative programming framework is really really really hard. People build wildly different things that looks and acts very differently, and the last thing a developer wants to do is staying up at 3am to debug not their own code, but deep dive into the framework, and is still 10 hours away from realizing that the framework just haven’t take that edge case into account, and the only way to really fix it is to reverse the order of how the framework interpret 50% of the code.

Basically it’s just a very long way to say “we hate black magic”, and having a good “developer ergonomics/experience” is a big missing piece that previous attempts of declarative UI framework missed. Stuff like debugger and breakpoints, log, and a syntax that you are already used to, are really helpful, and by using an imperative programming language like JavaScript, it makes React (and similar UI frameworks) very attractive to developers.

There are also a lot of other reason why people find React attractive, and they will be cover in later chapters with other mental models. So stay tune ! ⏰

## Separation of concerns

I feel like one of the biggest concerns some developers have had with the React.js kind of declarative UI is that “it violates the [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)”. While I’ll admit that now that everything can be in the same place, it can be tempting to just “nah I will just throw everything this one class”. It’s just that XML is not necessarily a good way to “separate concerns” either. For example, “show ProgressBar when loading, show RecyclerView when load finished”, I would definitely classify that as view logic, but the Java/Kotlin code is the one that triggers that. Simple cases like this can be mitigated with data binding, but then you can also [go way over-board with it](https://medium.com/@hellotimmutton/an-argument-against-data-binding-13e2aaf7a9b1) as well, and add business logic into XML.

What I am trying to say, is that while XML encourages separation of concerns, sometimes XML can give us the illusion that it is actually there when it’s not. And the limitation of it being just a markup language makes it harder to see the big picture at once. Having the UI + UI logic + business logic (+ more) in the same syntax makes it a lot easier to refactor (or just simple re-organize) them, into the most logical “concern” that it actually belongs.

So that wraps up chapter 2, and again, more chapters are coming up. If you have any comments, ideas, or feedback, leave a comment down below, or find me on twitter! 🐦
[**Louis Tsai**
*The latest Tweets from Louis Tsai (@louis993546). if someone can give me a lesson of how to adult that'd be great thank…*twitter.com](https://twitter.com/louis993546)
