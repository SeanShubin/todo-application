package com.seanshubin.todo.application.core

import java.nio.charset.Charset

import com.seanshubin.todo.application.contract.ClassLoaderContract

class ClassPathHandlerRequest(prefix: String,
                              classLoader: ClassLoaderContract,
                              mimeTypeByExtension: Map[String, String],
                              charset: Charset) extends NamedBytesHandlerRequest(mimeTypeByExtension, charset) {

  override def pathToBytes(path: String): Option[Seq[Byte]] = {
    val maybeInputStream = Option(classLoader.getResourceAsStream(prefix + path))
    maybeInputStream.map(IoUtil.inputStreamToBytes)
  }
}
