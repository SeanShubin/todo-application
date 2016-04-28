package com.seanshubin.todo.application.core

sealed trait ResponseValue {
  def headers: Seq[(String, String)]

  def statusCode: Int

  def bytes: Seq[Byte]
}

object ResponseValue {

  case class ContentResponse(statusCode: Int, contentType: ContentType, bytes: Seq[Byte]) extends ResponseValue {
    override def headers(): Seq[(String, String)] = Seq("Content-Type" -> contentType.toString)
  }

  case class RedirectResponse(newPath: String) extends ResponseValue {
    override def headers: Seq[(String, String)] = Seq("Location" -> newPath)

    override def statusCode: Int = 301

    override def bytes: Seq[Byte] = Seq()
  }

}
