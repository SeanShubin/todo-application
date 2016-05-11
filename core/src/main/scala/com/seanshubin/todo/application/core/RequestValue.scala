package com.seanshubin.todo.application.core

case class RequestValue(path: String, body: Seq[Byte] = Seq())
