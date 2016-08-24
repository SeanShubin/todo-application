package com.seanshubin.todo.application.domain

import java.net.ConnectException
import java.util

import com.google.api.client.http._
import com.google.api.client.http.javanet.NetHttpTransport

import scala.collection.JavaConverters._

class GoogleHttpClient extends HttpClient {
  val httpTransport: HttpTransport = new NetHttpTransport()
  val factory: HttpRequestFactory = httpTransport.createRequestFactory()
  val buildRequestMap: Map[String, (GenericUrl, Array[Byte]) => HttpRequest] = Map(
    "GET" -> buildGet,
    "POST" -> buildPost
  )

  def send(request: RequestValue): ResponseValue = {
    try {
      val genericUrl = new GenericUrl(request.uri.toString)
      val bytes = request.body.toArray
      val googleRequest = buildRequestMap(request.method)(genericUrl, bytes)
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

  def buildGet(url: GenericUrl, bytes: Array[Byte]): HttpRequest = {
    factory.buildGetRequest(url)
  }

  def buildPost(url: GenericUrl, bytes: Array[Byte]): HttpRequest = {
    val content = new ByteArrayContent(null, bytes)
    factory.buildPostRequest(url, content)
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
