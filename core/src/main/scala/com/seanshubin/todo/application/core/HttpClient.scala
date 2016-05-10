package com.seanshubin.todo.application.core

trait HttpClient {
  def send(request: ClientRequest): ClientResponse
}
