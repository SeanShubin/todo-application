package com.seanshubin.todo.application.core

trait ValueHandler {
  def handle(request: RequestValue): Option[ResponseValue]
}
