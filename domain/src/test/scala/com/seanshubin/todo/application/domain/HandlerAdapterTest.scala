package com.seanshubin.todo.application.domain

import java.net.URI
import java.nio.charset.{Charset, StandardCharsets}
import java.util
import javax.servlet.{ReadListener, ServletInputStream, ServletOutputStream, WriteListener}

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
    val uri = new URI("/path")
    val request = new StubRequest(uri)
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
    val headers = Headers.Empty
    val maybeResponseValue = Some(ResponseValue.plainText(200, headers, text, charset))
    val valueHandler = new StubRequestValueHandler(maybeResponseValue)
    val handlerAdapter = new HandlerAdapter(valueHandler)
    val target = "target"
    val channel: HttpChannel = null
    val input: HttpInput = null
    val baseRequest = new Request(channel, input)
    val uri = new URI("/path")
    val request = new StubRequest(uri)
    val response = new StubResponse
    //when
    handlerAdapter.handle(target, baseRequest, request, response)
    //then
    assert(baseRequest.isHandled === true)
    assert(response.headers.entries === Seq(("Content-Type", "text/plain; charset=UTF-8")))
    assert(response.statusCode === 200)
    assert(response.stubOutputStream.asText(charset) === "hello")
  }

  class StubRequestValueHandler(maybeResponseValue: Option[ResponseValue]) extends RequestValueHandler {
    override def handle(request: RequestValue): Option[ResponseValue] = maybeResponseValue
  }

  class StubRequest(uri: URI) extends HttpServletRequestNotImplemented {
    override def getRequestURI: String = uri.toString

    override def getQueryString: String = uri.getQuery

    override def getRemoteHost: String = uri.getHost

    override def getRemotePort: Int = uri.getPort

    override def getRemoteUser: String = uri.getUserInfo

    override def getScheme: String = uri.getScheme

    override def getMethod: String = "GET"

    override def getInputStream: ServletInputStream = new StubInputStream

    override def getHeaderNames: util.Enumeration[String] = new StubEnumeration[String](Seq())
  }

  class StubEnumeration[T](elements: Seq[T]) extends util.Enumeration[T] {
    var index = 0

    override def hasMoreElements: Boolean = index < elements.size

    override def nextElement(): T = {
      val element = elements(index)
      index += 1
      element
    }
  }

  class StubInputStream extends ServletInputStream {
    override def isFinished: Boolean = ???

    override def isReady: Boolean = ???

    override def setReadListener(readListener: ReadListener): Unit = ???

    override def read(): Int = -1
  }

  class StubResponse extends HttpServletResponseNotImplemented {
    var headers = Headers.Empty
    var statusCode = -1
    val stubOutputStream = new StubOutputStream

    override def setStatus(sc: Int): Unit = statusCode = sc

    override def getOutputStream: ServletOutputStream = stubOutputStream

    override def setHeader(name: String, value: String): Unit = headers = headers.appendOrUpdateEntry(name, value)
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

