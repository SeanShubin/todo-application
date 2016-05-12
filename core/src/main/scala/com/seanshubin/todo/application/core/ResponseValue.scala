package com.seanshubin.todo.application.core

import java.nio.charset.Charset

case class ResponseValue(statusCode: Int, headers: Headers, bytes: Seq[Byte])

object ResponseValue {
  def plainText(statusCode: Int, headers: Headers, text: String, charset: Charset): ResponseValue = {
    val bytes = text.getBytes(charset)
    val headersWithContentType = headers.setContentType("text/plain", charset)
    ResponseValue(statusCode, headersWithContentType, bytes)
  }

  def redirect(newPath: String): ResponseValue = {
    ResponseValue(301, Headers.Empty.appendEntry("Location", newPath), Seq())
  }
}
