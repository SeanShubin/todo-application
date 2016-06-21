# Application layer for Scala training sample project

## Check out the sample projects

    mkdir training
    cd training
    git clone git@github.com:SeanShubin/todo-application
    git clone git@github.com:SeanShubin/todo-persistence
    git clone git@github.com:SeanShubin/todo-specification

### Install specification to your local maven repository
    cd todo-specification
    mvn install

### Package and run persistence
    cd todo-persistence
    mvn package
    ./run.sh

### Package and run application
    cd todo-persistence
    mvn package
    ./run.sh

### Navigate to application

http://localhost:7001


## Design principles
- Meet Customer Need
- Easy To Maintain (same as: Easy To Test)
- Clearly Express Intent
- No Duplicate Code
- Concise As Possible

## Other designs are possible
- You may not agree with every design choice I made
- The important thing is that you understand why I have applied these design principles in this case, so you can decide for yourself if the same design principles apply to your case
- Keep in mind that I am demonstrating how to write code that is easy to maintain, not easy to write
- Code is initially written once, by few, but maintained perpetually, by many
- It takes a great deal of discipline and effort to write maintainable code, but it is not complicated once you know what to do
- Feel free to point out any improvements that make the code easier to maintain

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
    - Tests are good at influencing the design towards design by contract
    - Tests are good at catching regressions after something has been confirmed to work
    - Tests are not a substitute for actually checking if the thing works initially
    - [types of tests](http://seanshubin.com/types-of-tests.svg)
- Design by Contract
    - Organize code in logical units such that
        - a contract is implied by naming, signature, interface, specification, or documentation.
        - the caller is responsible for the preconditions of the contract
        - the implementor is responsible for the postconditions and invariants of the contract
        - an exception is thrown if and only if the contract cannot be fulfilled
        - this is the opposite of defensive programming
- Service Oriented Architecture
    - The only shared design is at the network specification (in this case, http)
    - Other than that, application and persistence know nothing about each other
    - There is no shared code, no binary dependency relationship, and they are never loaded into the same jvm
    - This frees up both application and persistence to be as simple as they can be on their own, at the cost of some duplication
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
- Lambda Architecture
    - at the persistence level
        - no updates
        - no deletes
    - this does not mean you can't have mutable persistence, but only the immutable persistence is canonical
    - mutable persistence must be entirely derivable from the immutable persistence
    - the essence of lambda architecture lies in how you organize your data
        - canonical data should be simple and permanent (remember: canonical, simple, permanent)
        - only allow data to be complex if it can be treated as transient, re-derived if necessary (remember: derived, complex, transient)
- No mocks
    - First, some definitions from [Martin Fowler's Article](http://martinfowler.com/articles/mocksArentStubs.html)
        - Dummy objects are passed around but never actually used. Usually they are just used to fill parameter lists.
        - Fake objects actually have working implementations, but usually take some shortcut which makes them not suitable for production (an in memory database is a good example).
        - Stubs provide canned answers to calls made during the test, usually not responding at all to anything outside what's programmed in for the test. Stubs may also record information about calls, such as an email gateway stub that remembers the messages it 'sent', or maybe only how many messages it 'sent'.
        - Mocks are what we are talking about here: objects pre-programmed with expectations which form a specification of the calls they are expected to receive.
    - while I don't have a problem with mocks in principle, you should only reach for them when dummys, stubs, or fakes will not work
    - mocks encourage exercising rather than testing your code
    - sometimes exercising your code is what you want, such as for controllers that do nothing but delegate to other classes
    - but you can still test that with stubs or fakes, and with stubs you can refactor duplication
    - refactor enough duplication, and your stub starts to look more and more like a fake
    - and can re-use the behavior across many tests
- Given, when, then
    - no given a, when b, then c, when d, then e
    - if I need that, I will break it up into two tests
        - given a, when b, then c
        - given a b, when d, then e
