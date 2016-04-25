package com.seanshubin.todo.application.console

import com.seanshubin.todo.application.core._

trait TopLevelWiring {
  def commandLineArguments: Seq[String]

  lazy val runner: Runnable = new Runner()
}
