package com.seanshubin.todo.application.core

class RedirectHandler(redirects: Map[String, String]) extends ValueHandler {
  override def handle(request: RequestValue): Option[ResponseValue] = {
    redirects.get(request.path).map {
      destination =>
        val response = ResponseValue.RedirectResponse(destination)
        response
    }
  }
}
