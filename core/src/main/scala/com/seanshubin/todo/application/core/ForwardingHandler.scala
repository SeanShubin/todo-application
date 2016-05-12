package com.seanshubin.todo.application.core

class ForwardingHandler(prefix: String, host: String, port: Int, httpClient: HttpClient) extends RequestValueHandler {
  override def handle(request: RequestValue): Option[ResponseValue] = {
    if (request.uri.path.startsWith(prefix)) {
      val path = request.uri.path.substring(prefix.length)
      val clientRequest = request.updatePath(path).updateHost(host).updatePort(port)
      val clientResponse = httpClient.send(clientRequest)
      Some(clientResponse)
    } else {
      None
    }
  }
}
