package com.seanshubin.todo.application.domain

class CompositeHandlerRequest(handlers: RequestValueHandler*) extends RequestValueHandler {
  override def handle(request: RequestValue): Option[ResponseValue] = {
    handlers.toStream.flatMap(_.handle(request)).headOption
  }
}
