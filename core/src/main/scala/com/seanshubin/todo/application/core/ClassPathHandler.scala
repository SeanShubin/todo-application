package com.seanshubin.todo.application.core

import com.seanshubin.todo.application.contract.ClassLoaderContract

class ClassPathHandler(prefix: String,
                       classLoader: ClassLoaderContract,
                       contentTypeByExtension: Map[String, ContentType]) extends ValueHandler {
  override def handle(request: RequestValue): Option[ResponseValue] = {
    val resourceName = prefix + request.path
    val maybeExtension = getExtension(resourceName)
    maybeExtension match {
      case Some(extension) =>
        val maybeContentType = contentTypeByExtension.get(extension)
        maybeContentType match {
          case Some(contentType) =>
            val inputStream = classLoader.getResourceAsStream(resourceName)
            if (inputStream == null) {
              None
            } else {
              val statusCode = 200
              val body = IoUtil.inputStreamToBytes(inputStream)
              val response = ResponseValue(statusCode, contentType, body)
              Some(response)
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
