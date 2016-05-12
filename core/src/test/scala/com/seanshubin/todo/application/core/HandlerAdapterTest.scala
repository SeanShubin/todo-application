package com.seanshubin.todo.application.core

import java.nio.charset.{Charset, StandardCharsets}
import javax.servlet.{ServletOutputStream, WriteListener}

import org.eclipse.jetty.server.{HttpChannel, HttpInput, Request}
import org.scalatest.FunSuite

import scala.collection.mutable.ArrayBuffer

/*
test-driven-006
As we try to hook up our ClassPathHandler, we notice that a jetty Handler is expected
No problem, that is what the adapter pattern is for
Notice that we did not let the jetty specific details dictate our design
We designed for simplicity, then used an adaptor to bridge the gap
Now we can test that the server actually works by navigating a browser to http://localhost:4000/todo-list-style-showcase.html
 */
class HandlerAdapterTest extends FunSuite {
  test("do nothing if no response") {
    //given
    val maybeResponseValue = None
    val valueHandler = new StubRequestValueHandler(maybeResponseValue)
    val handlerAdapter = new HandlerAdapter(valueHandler)
    val target = "target"
    val channel: HttpChannel = null
    val input: HttpInput = null
    val baseRequest = new Request(channel, input)
    val pathInfo = "/path"
    val request = new StubRequest(pathInfo)
    val response = new StubResponse
    //when
    handlerAdapter.handle(target, baseRequest, request, response)
    //then
    assert(baseRequest.isHandled === false)
  }

  test("forward resposne") {
    //given
    val charset = StandardCharsets.UTF_8
    val text = "hello"
    val maybeResponseValue = Some(ResponseValue.plainText(200, Headers.Empty.setContentType("text/plain", charset), text, charset))
    val valueHandler = new StubRequestValueHandler(maybeResponseValue)
    val handlerAdapter = new HandlerAdapter(valueHandler)
    val target = "target"
    val channel: HttpChannel = null
    val input: HttpInput = null
    val baseRequest = new Request(channel, input)
    val pathInfo = "/path"
    val request = new StubRequest(pathInfo)
    val response = new StubResponse
    //when
    handlerAdapter.handle(target, baseRequest, request, response)
    //then
    assert(baseRequest.isHandled === true)
    assert(response.headers === Map("Content-Type" -> "text/plain; charset=UTF-8"))
    assert(response.statusCode === 200)
    assert(response.stubOutputStream.asText(charset) === "hello")
  }

  class StubRequestValueHandler(maybeResponseValue: Option[ResponseValue]) extends RequestValueHandler {
    override def handle(request: RequestValue): Option[ResponseValue] = maybeResponseValue
  }

  class StubRequest(pathInfo: String) extends HttpServletRequestNotImplemented {
    override def getPathInfo: String = pathInfo
  }

  class StubResponse extends HttpServletResponseNotImplemented {
    var headers = Map[String, String]()
    var statusCode = -1
    val stubOutputStream = new StubOutputStream

    override def addHeader(name: String, value: String): Unit = {
      headers += (name -> value)
    }

    override def setStatus(sc: Int): Unit = statusCode = sc

    override def getOutputStream: ServletOutputStream = stubOutputStream
  }

  class StubOutputStream extends ServletOutputStream {
    val bytes = new ArrayBuffer[Byte]

    def asText(charset: Charset) = new String(bytes.toArray, charset)

    override def isReady: Boolean = ???

    override def setWriteListener(writeListener: WriteListener): Unit = ???

    override def write(b: Int): Unit = {
      bytes.append(b.toByte)
    }
  }

}

