package com.seanshubin.todo.application.domain

trait RequestValueHandler {
  def handle(request: RequestValue): Option[ResponseValue]
}
