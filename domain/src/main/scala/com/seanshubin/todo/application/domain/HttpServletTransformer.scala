package com.seanshubin.todo.application.domain

import javax.servlet.http.{HttpServletRequest, HttpServletResponse}

import scala.collection.JavaConverters._

object HttpServletTransformer {
  def readRequestValue(request: HttpServletRequest): RequestValue = {
    val path = request.getRequestURI
    val query = request.getQueryString
    val host = request.getRemoteHost
    val port = request.getRemotePort
    val userInfo = request.getRemoteUser
    val scheme = request.getScheme
    val fragment = null
    val uri = new UriValue(scheme, userInfo, host, port, path, query, fragment)
    val method = request.getMethod
    val body = IoUtil.inputStreamToBytes(request.getInputStream)
    val headerNames = request.getHeaderNames.asScala
    val headerEntries = for {
      headerName <- headerNames
    } yield {
      (headerName, request.getHeader(headerName))
    }
    val headers = Headers(headerEntries.toSeq)
    val value = RequestValue(uri, method, headers, body)
    value
  }

  def writeResponseValue(value: ResponseValue, response: HttpServletResponse): Unit = {
    val ResponseValue(statusCode, headers, body) = value
    response.setStatus(statusCode)
    for {
      (key, value) <- headers.entries
    } {
      response.setHeader(key, value)
    }
    IoUtil.bytesToOutputStream(body.toArray, response.getOutputStream)
  }
}
