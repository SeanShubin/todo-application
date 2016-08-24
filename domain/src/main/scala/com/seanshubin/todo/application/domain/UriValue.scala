package com.seanshubin.todo.application.domain

import java.net.URI

case class UriValue(scheme: String, user: String, host: String, port: Int, path: String, query: String, fragment: String) {
  override def toString: String = new URI(scheme, user, host, port, path, query, fragment).toString
}
