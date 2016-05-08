package com.seanshubin.todo.application.core

abstract class NamedBytesHandlerRequest(contentTypeByExtension: Map[String, ContentType]) extends RequestValueHandler {
  def pathToBytes(path: String): Option[Seq[Byte]]

  override final def handle(request: RequestValue): Option[ResponseValue] = {
    val resourceName = request.path
    val maybeExtension = getExtension(resourceName)
    maybeExtension match {
      case Some(extension) =>
        val maybeContentType = contentTypeByExtension.get(extension)
        maybeContentType match {
          case Some(contentType) =>
            val maybeBytes = pathToBytes(resourceName)
            maybeBytes.map {
              bytes =>
                val statusCode = 200
                val response = ResponseValue.ContentResponse(statusCode, contentType, bytes)
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
