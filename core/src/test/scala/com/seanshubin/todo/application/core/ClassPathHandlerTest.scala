package com.seanshubin.todo.application.core

/*
test-driven-005
Now that we have the jetty server running, we notice its handler is not implemented
Since we don't have a container, lets add the ability to serve from the class path
Since loading from the class path has nothing to do with jetty, we will create our own request/response types
We don't want to recompile every time we make a change, so we also give priority to the file system when loading
 */
class ClassPathHandlerTest {

}
