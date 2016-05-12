package com.seanshubin.todo.application.core

import org.scalatest.FunSuite

class RedirectHandlerTest extends FunSuite {
  test("redirect found") {
    //given
    val redirects = Map("/foo" -> "/bar")
    val redirectHandler = new RedirectHandlerRequest(redirects)
    val request = RequestValue.path("/foo")
    //when
    val Some(response) = redirectHandler.handle(request)
    //then
    assert(response.headers.entries === Seq("Location" -> "/bar"))
    assert(response.bytes === Seq())
    assert(response.statusCode === 301)
  }

  test("redirect not found") {
    //given
    val redirects = Map("/foo" -> "/bar")
    val redirectHandler = new RedirectHandlerRequest(redirects)
    val request = RequestValue.path("/baz")
    //when
    val maybeResponse = redirectHandler.handle(request)
    //then
    assert(maybeResponse === None)
  }
}
