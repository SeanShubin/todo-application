package com.seanshubin.todo.application.core

import org.scalatest.FunSuite

/*
test-driven-003
Once we got the JettyRunnerTest working, we tried to wire it into the entry point
This made us notice that JettyRunner depends on a port, so now we have to add code that configures the port
 */
class CommandLineArgumentsValidatorTest extends FunSuite {
  test("valid configuration") {
    //given
    val commandLineArguments = Seq("12345", "host", "23456")
    val validator = new CommandLineArgumentsConfigurationValidator(commandLineArguments)
    //when
    val configuration = validator.validate()
    //then
    assert(configuration.port === 12345)
    assert(configuration.databaseApiHost === "host")
    assert(configuration.databaseApiPort === 23456)
  }

  test("server port is required") {
    //given
    val commandLineArguments = Seq()
    val validator = new CommandLineArgumentsConfigurationValidator(commandLineArguments)
    //when
    val exception = intercept[RuntimeException] {
      validator.validate()
    }
    //then
    assert(exception.getMessage === "In command line arguments at position 0, expected 'server port', was missing")
  }

  test("server port mut be an integer") {
    //given
    val commandLineArguments = Seq("blah")
    val validator = new CommandLineArgumentsConfigurationValidator(commandLineArguments)
    //when
    val exception = intercept[RuntimeException] {
      validator.validate()
    }
    //then
    assert(exception.getMessage === "In command line arguments at position 0, unable to convert value for 'server port' to an integer, got 'blah'")
  }

  test("database api host is required") {
    //given
    val commandLineArguments = Seq("12345")
    val validator = new CommandLineArgumentsConfigurationValidator(commandLineArguments)
    //when
    val exception = intercept[RuntimeException] {
      validator.validate()
    }
    //then
    assert(exception.getMessage === "In command line arguments at position 1, expected 'database api host', was missing")
  }

  test("database api port is required") {
    //given
    val commandLineArguments = Seq("12345", "host")
    val validator = new CommandLineArgumentsConfigurationValidator(commandLineArguments)
    //when
    val exception = intercept[RuntimeException] {
      validator.validate()
    }
    //then
    assert(exception.getMessage === "In command line arguments at position 2, expected 'database api port', was missing")
  }

  test("database api port is must be an integer") {
    //given
    val commandLineArguments = Seq("12345", "host", "blah")
    val validator = new CommandLineArgumentsConfigurationValidator(commandLineArguments)
    //when
    val exception = intercept[RuntimeException] {
      validator.validate()
    }
    //then
    assert(exception.getMessage === "In command line arguments at position 2, unable to convert value for 'database api port' to an integer, got 'blah'")
  }
}
