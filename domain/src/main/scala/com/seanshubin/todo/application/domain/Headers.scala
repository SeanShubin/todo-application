package com.seanshubin.todo.application.domain

import java.nio.charset.Charset

case class Headers(entries: Seq[(String, String)]) {
  validate()

  def setContentType(mimeType: String, charset: Charset): Headers = {
    appendOrUpdateEntry("Content-Type", s"$mimeType; charset=$charset")
  }

  def appendOrUpdateEntry(name: String, value: String): Headers = {
    val index = entries.indexWhere(entry => name.equalsIgnoreCase(entry._1))
    if (index == -1) {
      appendEntry(name, value)
    } else {
      updateEntry(index, name, value)
    }
  }

  def appendEntry(name: String, value: String): Headers = {
    Headers(entries :+(name, value))
  }

  def updateEntry(index: Int, name: String, value: String): Headers = {
    Headers(entries.take(index) ++ Seq((name, value)) ++ entries.drop(index))
  }

  def validate(): Unit = {
    val names = entries.map(_._1).map(_.toLowerCase)
    validate(names.toList)
  }

  def validate(names: List[String]): Unit = {
    if (names.nonEmpty) {
      val head :: tail = names
      if (tail.contains(head)) {
        throw new RuntimeException(s"Duplicate header name '$head'")
      }
    }
  }
}

object Headers {
  val Empty: Headers = Headers(Seq())
}
