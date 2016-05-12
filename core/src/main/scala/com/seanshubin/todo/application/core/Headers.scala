package com.seanshubin.todo.application.core

import java.nio.charset.Charset

case class Headers(entries: Seq[(String, String)]) {
  validate()

  def setContentType(mimeType: String, charset: Charset): Headers = {
    appendOrUpdateEntry("Content-Type", s"$mimeType; charset=$charset")
  }

  def appendOrUpdateEntry(key: String, value: String): Headers = {
    val index = entries.indexWhere(entry => key.equalsIgnoreCase(entry._1))
    if (index == -1) {
      appendEntry(key, value)
    } else {
      updateEntry(index, key, value)
    }
  }

  def appendEntry(key: String, value: String): Headers = {
    Headers(entries :+(key, value))
  }

  def updateEntry(index: Int, key: String, value: String): Headers = {
    Headers(entries.take(index) ++ Seq((key, value)) ++ entries.drop(index))
  }

  def validate(): Unit = {
    val keys = entries.map(_._1).map(_.toLowerCase)
    validate(keys.toList)
  }

  def validate(keys: List[String]): Unit = {
    if (keys.nonEmpty) {
      val head :: tail = keys
      if (tail.contains(head)) {
        throw new RuntimeException(s"Duplicate key '$head'")
      }
    }
  }
}

object Headers {
  val Empty: Headers = Headers(Seq())
}
