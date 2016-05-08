package com.seanshubin.todo.application.core

class RedirectHandlerRequest(redirects: Map[String, String]) extends RequestValueHandler {
  override def handle(request: RequestValue): Option[ResponseValue] = {
    redirects.get(request.path).map {
      destination =>
        val response = ResponseValue.RedirectResponse(destination)
        response
    }
  }
}
