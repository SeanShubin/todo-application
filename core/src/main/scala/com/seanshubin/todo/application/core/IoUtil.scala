package com.seanshubin.todo.application.core

import java.io.{ByteArrayInputStream, ByteArrayOutputStream, InputStream, OutputStream}

import scala.annotation.tailrec

object IoUtil {
  def inputStreamToBytes(inputStream: InputStream): Array[Byte] = {
    val outputStream = new ByteArrayOutputStream
    feedInputStreamToOutputStream(inputStream, outputStream)
    val byteArray = outputStream.toByteArray
    byteArray
  }

  def bytesToOutputStream(bytes: Seq[Byte], outputStream: OutputStream): Unit = {
    val inputStream = new ByteArrayInputStream(bytes.toArray)
    feedInputStreamToOutputStream(inputStream, outputStream)
  }

  def feedInputStreamToOutputStream(inputStream: InputStream, outputStream: OutputStream) {
    @tailrec
    def loop(byte: Int) {
      if (byte != -1) {
        outputStream.write(byte)
        loop(inputStream.read())
      }
    }
    loop(inputStream.read())
  }

}
