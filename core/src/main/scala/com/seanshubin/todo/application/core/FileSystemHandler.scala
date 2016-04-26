package com.seanshubin.todo.application.core

import java.nio.file.Path

import com.seanshubin.todo.application.contract.FilesContract

class FileSystemHandler(directory: Path,
                        files: FilesContract,
                        contentTypeByExtension: Map[String, String]) extends ValueHandler {
  override def handle(request: RequestValue): Option[ResponseValue] = {
    val file = directory.resolve(request.path)
    if (files.exists(file)) {
      val maybeExtension = getExtension(file.toString)
      maybeExtension match {
        case Some(extension) =>
          val maybeContentType = contentTypeByExtension.get(extension)
          maybeContentType match {
            case Some(contentType) =>
              val statusCode = 200
              val body = files.readAllBytes(file)
              val response = ResponseValue(statusCode, contentType, body)
              Some(response)
            case None =>
              throw new RuntimeException(s"Unable to find content type for extension $extension")
          }
        case None =>
          throw new RuntimeException(s"Unable to find extension for $file (needed to compute content type)")
      }
    } else {
      None
    }
  }

  def getExtension(name: String): Option[String] = {
    val lastDot = name.lastIndexOf('.')
    val maybeExtension =
      if (name.lastIndexOf('.') == -1) None
      else Some(name.substring(lastDot))
    maybeExtension
  }
}
