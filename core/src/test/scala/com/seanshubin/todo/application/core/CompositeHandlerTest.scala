package com.seanshubin.todo.application.core

import com.seanshubin.todo.application.core.ResponseValue.ContentResponse
import org.scalatest.FunSuite

class CompositeHandlerTest extends FunSuite {
  test("both handlers none, returns none") {
    //given
    val handlerA = new StubHandlerRequest(None)
    val handlerB = new StubHandlerRequest(None)
    val compositeHandler = new CompositeHandlerRequest(handlerA, handlerB)
    val dummyRequest: RequestValue = null
    //when
    val maybeResponse = compositeHandler.handle(dummyRequest)
    //then
    assert(maybeResponse === None)
  }

  test("both handlers set, return first") {
    //given
    val responseA = ContentResponse(200, ContentType("response a", maybeCharset = None), Seq())
    val responseB = ContentResponse(200, ContentType("response b", maybeCharset = None), Seq())
    val handlerA = new StubHandlerRequest(Some(responseA))
    val handlerB = new StubHandlerRequest(Some(responseB))
    val compositeHandler = new CompositeHandlerRequest(handlerA, handlerB)
    val dummyRequest: RequestValue = null
    //when
    val maybeResponse = compositeHandler.handle(dummyRequest)
    //then
    assert(maybeResponse === Some(responseA))
  }

  test("only first handler set") {
    //given
    val responseA = ContentResponse(200, ContentType("response a", maybeCharset = None), Seq())
    val handlerA = new StubHandlerRequest(Some(responseA))
    val handlerB = new StubHandlerRequest(None)
    val compositeHandler = new CompositeHandlerRequest(handlerA, handlerB)
    val dummyRequest: RequestValue = null
    //when
    val maybeResponse = compositeHandler.handle(dummyRequest)
    //then
    assert(maybeResponse === Some(responseA))
  }

  test("only second handler set") {
    //given
    val responseB = ContentResponse(200, ContentType("response b", maybeCharset = None), Seq())
    val handlerA = new StubHandlerRequest(None)
    val handlerB = new StubHandlerRequest(Some(responseB))
    val compositeHandler = new CompositeHandlerRequest(handlerA, handlerB)
    val dummyRequest: RequestValue = null
    //when
    val maybeResponse = compositeHandler.handle(dummyRequest)
    //then
    assert(maybeResponse === Some(responseB))
  }

  class StubHandlerRequest(maybeResponse: Option[ResponseValue]) extends RequestValueHandler {
    override def handle(request: RequestValue): Option[ResponseValue] = maybeResponse
  }

}
