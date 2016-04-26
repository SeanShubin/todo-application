package com.seanshubin.todo.application.core

case class ResponseValue(statusCode: Int, contentType: ContentType, bytes: Seq[Byte]) {
  def asText = new String(bytes.toArray, contentType.maybeCharset.get)
}
