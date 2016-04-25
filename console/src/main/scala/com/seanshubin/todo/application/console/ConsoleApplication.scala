package com.seanshubin.todo.application.console

object ConsoleApplication extends App {
  new TopLevelWiring {
    override def commandLineArguments: Seq[String] = args
  }.runner.run()
}
