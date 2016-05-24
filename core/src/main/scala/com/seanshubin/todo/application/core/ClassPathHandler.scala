package com.seanshubin.todo.application.core

import java.nio.charset.Charset

import com.seanshubin.todo.application.contract.ClassLoaderContract

class ClassPathHandler(prefix: String,
                       classLoader: ClassLoaderContract,
                       mimeTypeByExtension: Map[String, String],
                       charset: Charset) extends NamedBytesHandler(mimeTypeByExtension, charset) {

  override def pathToBytes(path: String): Option[Seq[Byte]] = {
    val resourceName = prefix + path
    val maybeInputStream = Option(classLoader.getResourceAsStream(resourceName))
    maybeInputStream.map(IoUtil.inputStreamToBytes)
  }
}
