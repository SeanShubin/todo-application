package com.seanshubin.todo.application.core

import javax.servlet.http.{HttpServletRequest, HttpServletResponse}

import org.eclipse.jetty.server.Request
import org.eclipse.jetty.server.handler.AbstractHandler

class HandlerAdapter(delegate: RequestValueHandler) extends AbstractHandler {
  override def handle(target: String, baseRequest: Request, request: HttpServletRequest, response: HttpServletResponse): Unit = {
    val emptyBody = Seq[Byte]()
    val requestValue = HttpServletTransformer.readRequestValue(request)
    val maybeResponseValue = delegate.handle(requestValue)
    maybeResponseValue match {
      case Some(responseValue) =>
        HttpServletTransformer.writeResponseValue(responseValue, response)
        baseRequest.setHandled(true)
      case None =>
      //do nothing
    }
  }
}
