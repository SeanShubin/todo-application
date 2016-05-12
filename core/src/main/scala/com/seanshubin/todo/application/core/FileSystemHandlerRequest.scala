package com.seanshubin.todo.application.core

import java.nio.charset.Charset
import java.nio.file.Path

import com.seanshubin.todo.application.contract.FilesContract

class FileSystemHandlerRequest(serveFromDirectory: Path,
                               files: FilesContract,
                               mimeTypeByExtension: Map[String, String],
                               charset: Charset) extends NamedBytesHandlerRequest(mimeTypeByExtension, charset) {
  override def pathToBytes(path: String): Option[Seq[Byte]] = {
    val file = serveFromDirectory.resolve(removeLeadingForwardSlash(path))
    if (files.exists(file)) {
      Some(files.readAllBytes(file))
    } else {
      None
    }
  }

  def removeLeadingForwardSlash(s: String): String = {
    if (s.startsWith("/")) s.substring(1)
    else throw new RuntimeException(s"Expected '$s' to start with a '/'")
  }
}
