package com.seanshubin.todo.application.domain

case class RequestValue(uri: UriValue, method: String, headers: Headers, body: Seq[Byte]) {
  def updatePath(path: String): RequestValue = copy(uri = uri.copy(path = path))

  def updateHost(host: String): RequestValue = copy(uri = uri.copy(host = host))

  def updatePort(port: Int): RequestValue = copy(uri = uri.copy(port = port))
}

object RequestValue {
  def path(path: String): RequestValue = {
    val scheme = null
    val user = null
    val host = null
    val port = 0
    val query = null
    val fragment = null
    val uri = UriValue(scheme, user, host, port, path, query, fragment)
    RequestValue(uri, "GET", Headers.Empty, Seq())
  }
}
