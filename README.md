# Todo Application sample for Scala training

## Differing opinions
- You may not agree with all of my design principles, and that is fine
- I am teaching one possible way to write maintainable code
- The important thing is that you understand why I have applied these design principles, so you can make an informed decision as to when to deviate from these principles
- Keep in mind that I have promised to show you how to write code that is easy to maintain, not easy to write
- Code is initially written once, by one person, but maintained perpetually, by multiple people
- So it is not unreasonable to trade some extra effort up front for ease of maintenance later
- Before objecting to any practice that seems like extra work up front, think about maintainability
- It takes a great deal of discipline and effort to write maintainable code, but it is not complicated once you know what to do
- With this in mind, I will counter any objection in the form of "but that takes so much effort write!", with something of the form "effort that makes code easier to maintain is worth it"

## Design Principles
- Structured Design
    - Low Coupling
    - High Cohesion
- Top Down Design
    - Bottom up design is great for prototyping, so start there if you don't have enough information about something to know how to test drive it
    - However, once you are actually touching user facing code, do not let the design of the prototype influence the design of the application
    - All user facing code must be test driven, the prototype is only for learning
- Agile Design
    - Unplanned design leads to spaghetti code
    - Planned design leads to a bunch of stuff you don't need
    - Agile design allows the design to evolve as needed
- Test Driven Design
    - [types of tests](http://seanshubin.com/types-of-tests.svg)
- Design by Contract
- Service Oriented Architecture
    - The only shared design is at the network specification (in this case, http)
    - Other than that, application and persistence know nothing about each other
    - There is no shared code, no binary dependency relationship, and they are never loaded into the same jvm
    - This frees up both application and persistence to be as simple as they can be on their own
    - Every logical data store should be behind its own service
- Layered Architecture
    - from Domain Driven Design
        - User Interface
        - Application
        - Domain
        - Infrastructure
    - todo-application (User Interface and Application)
    - todo-persistence (Domain and Infrastructure)
    - todo-specification (communication between Application and Domain)
- No mocks
    - while I don't have a problem with mocks in principle, you should only reach for them when dummys, stubs, or fakes will not work
    - mocks encourage exercising rather than testing your code
    - sometimes exercising your code is what you want, such as for controllers that do nothing but delegate to other classes
    - but you can still test that with stubs or fakes, and with stubs you can refactor duplication
    - refactor enough duplication, and your stub starts to look more and more like a fake
    - and can re-use the behavior across many tests
    - definitions I am using
        - dummy: a properly typed null that is never invoked, it is only used to get the application to compile
        - stub: a limited, deterministic implementation that only emulates and records just enough behavior for a small number of tests
        - fake: a deterministic implementation that simulates a large portion of behavior and is reusable across a large number of tests

## Definitions
- from [Martin Fowler's Article](http://martinfowler.com/articles/mocksArentStubs.html)
    - Dummy objects are passed around but never actually used. Usually they are just used to fill parameter lists.
    - Fake objects actually have working implementations, but usually take some shortcut which makes them not suitable for production (an in memory database is a good example).
    - Stubs provide canned answers to calls made during the test, usually not responding at all to anything outside what's programmed in for the test. Stubs may also record information about calls, such as an email gateway stub that remembers the messages it 'sent', or maybe only how many messages it 'sent'.
    - Mocks are what we are talking about here: objects pre-programmed with expectations which form a specification of the calls they are expected to receive.
