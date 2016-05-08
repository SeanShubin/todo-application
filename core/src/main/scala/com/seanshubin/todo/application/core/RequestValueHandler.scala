package com.seanshubin.todo.application.core

trait RequestValueHandler {
  def handle(request: RequestValue): Option[ResponseValue]
}
