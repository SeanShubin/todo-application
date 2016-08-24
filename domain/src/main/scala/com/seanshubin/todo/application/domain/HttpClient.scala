package com.seanshubin.todo.application.domain

trait HttpClient {
  def send(request: RequestValue): ResponseValue
}
