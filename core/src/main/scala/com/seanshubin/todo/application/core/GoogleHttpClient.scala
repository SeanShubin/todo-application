package com.seanshubin.todo.application.core

import com.google.api.client.http._
import com.google.api.client.http.javanet.NetHttpTransport

class GoogleHttpClient extends HttpClient {
  def send(request: ClientRequest): ClientResponse = {
    val ClientRequest(host, port, path, headers, body) = request
    val httpTransport: HttpTransport = new NetHttpTransport()
    val factory: HttpRequestFactory = httpTransport.createRequestFactory()
    val newUriString = s"http://$host:$port/$path"
    val genericUrl = new GenericUrl(newUriString)
    val contentType = extractContentType(headers)
    val content = new ByteArrayContent(contentType, body.toArray)
    val googleRequest = factory.buildPostRequest(genericUrl, content)
    val response = googleRequest.execute()
    val responseHeaders = extractHeaders(response)
    val responseBytes = extractBody(response)
    val statusCode = response.getStatusCode
    ClientResponse(statusCode, responseBytes, responseHeaders)
  }

  def extractContentType(headers: Seq[(String, String)]): String = {
    ???
  }

  def extractHeaders(response: HttpResponse): Seq[(String, String)] = {
    ???
  }

  def extractBody(response: HttpResponse): Seq[Byte] = {
    ???
  }
}
