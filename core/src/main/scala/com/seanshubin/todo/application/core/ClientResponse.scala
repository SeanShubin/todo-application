package com.seanshubin.todo.application.core

case class ClientResponse(statusCode: Int, body: Seq[Byte], headers: Seq[(String, String)])
