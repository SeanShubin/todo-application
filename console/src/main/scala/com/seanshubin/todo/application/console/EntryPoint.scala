package com.seanshubin.todo.application.console

object EntryPoint extends App {
  new EntryPointWiring {
    override def commandLineArguments: Seq[String] = args
  }.runner.run()
}
