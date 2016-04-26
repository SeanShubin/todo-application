package com.seanshubin.todo.application.core

class CompositeHandler(handlers: ValueHandler*) extends ValueHandler {
  override def handle(request: RequestValue): Option[ResponseValue] = {
    handlers.toStream.flatMap(_.handle(request)).headOption
  }
}
