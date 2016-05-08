package com.seanshubin.todo.application.core

import com.seanshubin.todo.application.contract.ClassLoaderContract

class ClassPathHandlerRequest(prefix: String,
                              classLoader: ClassLoaderContract,
                              contentTypeByExtension: Map[String, ContentType]) extends NamedBytesHandlerRequest(contentTypeByExtension) {

  override def pathToBytes(path: String): Option[Seq[Byte]] = {
    val maybeInputStream = Option(classLoader.getResourceAsStream(prefix + path))
    maybeInputStream.map(IoUtil.inputStreamToBytes)
  }
}
