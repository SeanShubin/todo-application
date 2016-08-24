package com.seanshubin.todo.application.domain

class RedirectHandlerRequest(redirects: Map[String, String]) extends RequestValueHandler {
  override def handle(request: RequestValue): Option[ResponseValue] = {
    redirects.get(request.uri.path).map {
      destination =>
        val response = ResponseValue.redirect(destination)
        response
    }
  }
}
