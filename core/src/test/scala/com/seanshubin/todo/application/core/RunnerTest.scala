package com.seanshubin.todo.application.core

import org.scalatest.FunSuite

class RunnerTest extends FunSuite {
  test("application flow") {
    val runner: Runnable = new Runner()
    runner.run()
  }
}
