package com.seanshubin.todo.application.core

import org.scalatest.FunSuite

class CompositeHandlerTest extends FunSuite {
  test("both handlers none, returns none") {
    //given
    val handlerA = new StubHandler(None)
    val handlerB = new StubHandler(None)
    val compositeHandler = new CompositeHandler(handlerA, handlerB)
    val dummyRequest: RequestValue = null
    //when
    val maybeResponse = compositeHandler.handle(dummyRequest)
    //then
    assert(maybeResponse === None)
  }

  test("both handlers set, return first") {
    //given
    val responseA = ResponseValue(200, ContentType("response a", maybeCharset = None), Seq())
    val responseB = ResponseValue(200, ContentType("response b", maybeCharset = None), Seq())
    val handlerA = new StubHandler(Some(responseA))
    val handlerB = new StubHandler(Some(responseB))
    val compositeHandler = new CompositeHandler(handlerA, handlerB)
    val dummyRequest: RequestValue = null
    //when
    val maybeResponse = compositeHandler.handle(dummyRequest)
    //then
    assert(maybeResponse === Some(responseA))
  }

  test("only first handler set") {
    //given
    val responseA = ResponseValue(200, ContentType("response a", maybeCharset = None), Seq())
    val handlerA = new StubHandler(Some(responseA))
    val handlerB = new StubHandler(None)
    val compositeHandler = new CompositeHandler(handlerA, handlerB)
    val dummyRequest: RequestValue = null
    //when
    val maybeResponse = compositeHandler.handle(dummyRequest)
    //then
    assert(maybeResponse === Some(responseA))
  }

  test("only second handler set") {
    //given
    val responseB = ResponseValue(200, ContentType("response b", maybeCharset = None), Seq())
    val handlerA = new StubHandler(None)
    val handlerB = new StubHandler(Some(responseB))
    val compositeHandler = new CompositeHandler(handlerA, handlerB)
    val dummyRequest: RequestValue = null
    //when
    val maybeResponse = compositeHandler.handle(dummyRequest)
    //then
    assert(maybeResponse === Some(responseB))
  }

  class StubHandler(maybeResponse: Option[ResponseValue]) extends ValueHandler {
    override def handle(request: RequestValue): Option[ResponseValue] = maybeResponse
  }

}
