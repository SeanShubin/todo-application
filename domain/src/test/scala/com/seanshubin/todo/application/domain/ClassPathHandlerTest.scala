package com.seanshubin.todo.application.domain

import java.nio.charset.StandardCharsets

import com.seanshubin.todo.application.contract.ClassLoaderDelegate
import org.scalatest.FunSuite

/*
test-driven-005
Now that we have the jetty server running, we notice its handler is not implemented
We only noticed just now because we are doing top down design
Since we don't have a container, lets add the ability to serve from the class path
Not having a container makes it easier to get our application behavior under test coverage without overhead
This forces us to design quite a bit of the domain, such as RequestValue, ResponseValue, and ContentType
Note that this design is high level
It does the minimal necessary to get enough information to compose a http response, without depending on jetty or the servlet api
Since we have full logic test coverage at such a high level, there is no need to test implementation details such as RegexUtil and IoUtil
This frees us up to change the details as necessary without changing a bunch of tests
If it turns out to be the case that some things are easier to test at the detail level to maintain full coverage, it is fine to write the more detailed tests once that is discovered
 */
class ClassPathHandlerTest extends FunSuite {
  val charset = StandardCharsets.UTF_8
  val mimeTypeByExtension = Map(".txt" -> "text/plain")

  test("load from class path") {
    //given
    val prefix = "serve-from-classpath"
    val classLoader = new ClassLoaderDelegate(getClass.getClassLoader)
    val classPathHandler = new ClassPathHandler(prefix, classLoader, mimeTypeByExtension, charset)
    val request = RequestValue.path("/hello.txt")
    //when
    val Some(response) = classPathHandler.handle(request)
    //then
    assert(response.statusCode === 200)
    assert(response.headers.entries === Seq("Content-Type" -> "text/plain; charset=UTF-8"))
  }

  test("not found in class path") {
    //given
    val prefix = "serve-from-classpath"
    val classLoader = new ClassLoaderDelegate(getClass.getClassLoader)
    val classPathHandler = new ClassPathHandler(prefix, classLoader, mimeTypeByExtension, charset)
    val request = RequestValue.path("/does-not-exist.txt")
    //when
    val maybeResponse = classPathHandler.handle(request)
    //then
    assert(maybeResponse === None)
  }

  test("content type not registered for extension") {
    //given
    val prefix = "serve-from-classpath"
    val classLoader = new ClassLoaderDelegate(getClass.getClassLoader)
    val classPathHandler = new ClassPathHandler(prefix, classLoader, mimeTypeByExtension, charset)
    val request = RequestValue.path("/unusual-extension.xhtml")
    //when
    val exception = intercept[RuntimeException] {
      classPathHandler.handle(request)
    }
    //then
    assert(exception.getMessage === "Unable to find content type for extension .xhtml")
  }

  test("no extension") {
    //given
    val prefix = "serve-from-classpath"
    val classLoader = new ClassLoaderDelegate(getClass.getClassLoader)
    val classPathHandler = new ClassPathHandler(prefix, classLoader, mimeTypeByExtension, charset)
    val request = RequestValue.path("/hello")
    //when
    val exception = intercept[RuntimeException] {
      classPathHandler.handle(request)
    }
    //then
    assert(exception.getMessage === "Unable to find extension for /hello (needed to compute content type)")
  }
}
