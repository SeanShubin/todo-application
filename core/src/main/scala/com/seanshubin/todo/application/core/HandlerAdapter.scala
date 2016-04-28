package com.seanshubin.todo.application.core

import javax.servlet.http.{HttpServletRequest, HttpServletResponse}

import org.eclipse.jetty.server.Request
import org.eclipse.jetty.server.handler.AbstractHandler

class HandlerAdapter(delegate: ValueHandler) extends AbstractHandler {
  override def handle(target: String, baseRequest: Request, request: HttpServletRequest, response: HttpServletResponse): Unit = {
    val requestValue = RequestValue(request.getPathInfo)
    val maybeResponseValue = delegate.handle(requestValue)
    maybeResponseValue match {
      case Some(responseValue) =>
        for {
          (name, value) <- responseValue.headers
        } {
          response.addHeader(name, value)
        }
        response.setStatus(responseValue.statusCode)
        IoUtil.bytesToOutputStream(responseValue.bytes, response.getOutputStream)
        baseRequest.setHandled(true)
      case None =>
      //do nothing
    }
  }
}
