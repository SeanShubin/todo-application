package com.seanshubin.todo.application.core

import com.seanshubin.todo.application.core.ResponseValue.ContentResponse

class ForwardingHandler(prefix: String, host: String, port: Int, httpClient: HttpClient) extends RequestValueHandler {
  override def handle(request: RequestValue): Option[ResponseValue] = {
    if (request.path.startsWith(prefix)) {
      val path = request.path.substring(prefix.size)
      val headers = Seq(("Content-Type", "text/plain; charset=UTF-8"))
      val body = request.body
      val clientRequest = ClientRequest(host, port, path, headers, body)
      val clientResponse = httpClient.send(clientRequest)
      val contentType = ContentType.fromHeaders(clientResponse.headers)
      val serverResponse = ContentResponse(clientResponse.statusCode, contentType, clientResponse.body)
      Some(serverResponse)
    } else {
      None
    }
  }
}
