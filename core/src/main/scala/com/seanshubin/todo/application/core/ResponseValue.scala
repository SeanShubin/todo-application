package com.seanshubin.todo.application.core

case class ResponseValue(statusCode:Int, contentType:String, bytes:Seq[Byte])
