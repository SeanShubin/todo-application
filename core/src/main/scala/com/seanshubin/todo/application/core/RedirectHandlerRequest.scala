package com.seanshubin.todo.application.core

class RedirectHandlerRequest(redirects: Map[String, String]) extends RequestValueHandler {
  override def handle(request: RequestValue): Option[ResponseValue] = {
    redirects.get(request.uri.path).map {
      destination =>
        val response = ResponseValue.redirect(destination)
        response
    }
  }
}
