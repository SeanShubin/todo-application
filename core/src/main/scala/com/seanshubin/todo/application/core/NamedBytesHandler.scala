package com.seanshubin.todo.application.core

import java.nio.charset.Charset

abstract class NamedBytesHandler(mimeTypeByExtension: Map[String, String], charset: Charset) extends RequestValueHandler {
  def pathToBytes(path: String): Option[Seq[Byte]]

  override final def handle(request: RequestValue): Option[ResponseValue] = {
    val resourceName = request.uri.path
    val maybeExtension = getExtension(resourceName)
    maybeExtension match {
      case Some(extension) =>
        val maybeContentType = mimeTypeByExtension.get(extension)
        maybeContentType match {
          case Some(contentType) =>
            val maybeBytes = pathToBytes(resourceName)
            val headers = Headers.Empty.setContentType(contentType, charset)
            maybeBytes.map {
              bytes =>
                val statusCode = 200
                val response = ResponseValue(statusCode, headers, bytes)
                response
            }
          case None =>
            throw new RuntimeException(s"Unable to find content type for extension $extension")
        }
      case None =>
        throw new RuntimeException(s"Unable to find extension for $resourceName (needed to compute content type)")
    }
  }

  def getExtension(name: String): Option[String] = {
    val lastDot = name.lastIndexOf('.')
    val maybeExtension =
      if (name.lastIndexOf('.') == -1) {
        None
      }
      else {
        Some(name.substring(lastDot))
      }
    maybeExtension
  }
}
