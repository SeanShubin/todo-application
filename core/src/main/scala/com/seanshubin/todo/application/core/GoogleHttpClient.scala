package com.seanshubin.todo.application.core

import java.net.ConnectException
import java.util

import com.google.api.client.http._
import com.google.api.client.http.javanet.NetHttpTransport

import scala.collection.JavaConverters._

class GoogleHttpClient extends HttpClient {
  def send(request: RequestValue): ResponseValue = {
    try {
      val httpTransport: HttpTransport = new NetHttpTransport()
      val factory: HttpRequestFactory = httpTransport.createRequestFactory()
      val genericUrl = new GenericUrl(request.uri.toString)
      val googleRequest = factory.buildGetRequest(genericUrl)
      val response = googleRequest.execute()
      val responseHeaders = extractHeaders(response)
      val responseBytes = extractBody(response)
      val statusCode = response.getStatusCode
      ResponseValue(statusCode, responseHeaders, responseBytes)
    } catch {
      case ex: ConnectException =>
        throw new RuntimeException(s"Error sending request: $request\n${ex.getMessage}")
    }
  }

  def extractContentType(headers: Seq[(String, String)]): String = {
    def keyMatchesContentType(entry: (String, String)): Boolean = {
      val (key, _) = entry
      "Content-Type".equalsIgnoreCase(key)
    }
    val contentTypeHeaders = headers.filter(keyMatchesContentType)
    if (contentTypeHeaders.isEmpty) {
      throw new RuntimeException("No content type in headers")
    } else if (contentTypeHeaders.size > 1) {
      throw new RuntimeException("More than one content type specified")
    } else {
      val (_, contentType) = contentTypeHeaders.head
      contentType
    }
  }

  def extractHeaders(response: HttpResponse): Headers = {
    val headers = response.getHeaders
    def toHeaderEntry(key: String): (String, String) = {
      val valueArrayList = headers.get(key).asInstanceOf[util.ArrayList[String]]
      val value = valueArrayList.asScala.mkString(",")
      (key, value)
    }
    Headers(headers.keySet().asScala.toSeq.map(toHeaderEntry))
  }

  def extractBody(response: HttpResponse): Seq[Byte] = {
    IoUtil.inputStreamToBytes(response.getContent)
  }
}
