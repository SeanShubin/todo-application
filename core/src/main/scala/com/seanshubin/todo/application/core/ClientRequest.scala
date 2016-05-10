package com.seanshubin.todo.application.core

case class ClientRequest(host: String, port: Int, path: String, headers: Seq[(String, String)], body: Seq[Byte])
