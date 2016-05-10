package com.seanshubin.todo.application.core

import java.nio.charset.Charset

case class ContentType(typeAndSubtype: String, maybeCharset: Option[Charset]) {
  override def toString: String = maybeCharset match {
    case Some(charset) => s"$typeAndSubtype; charset=$charset"
    case None => typeAndSubtype
  }
}

object ContentType {
  val wordPattern = """[\w\-]+"""
  val maybeSpacesPattern = """\s*"""
  val contentTypeOnlyPattern = RegexUtil.capture(wordPattern + "/" + wordPattern)
  val charsetPattern = "charset" + maybeSpacesPattern + "=" + maybeSpacesPattern + RegexUtil.capture(wordPattern)
  val contentTypePattern =
    contentTypeOnlyPattern + maybeSpacesPattern + RegexUtil.optional(";" + maybeSpacesPattern + charsetPattern)
  val ContentTypeRegex = contentTypePattern.r

  def fromString(value: String): ContentType = {
    value match {
      case ContentTypeRegex(typeAndSubtype, possiblyNullCharset) =>
        ContentType(typeAndSubtype, Option(possiblyNullCharset).map(Charset.forName))
      case _ =>
        throw new RuntimeException(s"Value '$value' does not match pattern '$ContentTypeRegex' for content type")
    }
  }

  def fromHeaders(headers: Seq[(String, String)]): ContentType = {
    val contentTypeHeaders = headers.filter(isContentTypeHeader)
    if (contentTypeHeaders.isEmpty) {
      throw new RuntimeException("Content-Type header not found")
    } else if (contentTypeHeaders.size > 1) {
      throw new RuntimeException("More than one Content-Type header found")
    } else {
      val (_, value) = contentTypeHeaders.head
      fromString(value)
    }
  }

  def isContentTypeHeader(entry: (String, String)): Boolean = {
    val (key, _) = entry
    key.equalsIgnoreCase("Content-Type")
  }
}
