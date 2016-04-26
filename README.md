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
- Top Down Design
- Test Driven Design
- Design by Contract
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

