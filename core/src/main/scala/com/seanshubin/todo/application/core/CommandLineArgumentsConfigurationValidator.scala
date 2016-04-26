package com.seanshubin.todo.application.core

class CommandLineArgumentsConfigurationValidator(commandLineArguments: Seq[String]) extends ConfigurationValidator {
  override def validate(): Configuration = {
    val port = validateCommandLineArgumentInt(0, "server port")
    val databaseApiHost = validateCommandLineArgumentString(1, "database api host")
    val databaseApiPort = validateCommandLineArgumentInt(2, "database api port")
    val configuration = Configuration(port = port, databaseApiHost = databaseApiHost, databaseApiPort = databaseApiPort)
    configuration
  }

  private def validateCommandLineArgumentInt(expectedPosition: Int, name: String): Int = {
    val asString = validateCommandLineArgumentString(expectedPosition, name)
    try {
      asString.toInt
    } catch {
      case ex: NumberFormatException =>
        throw new RuntimeException(s"In command line arguments at position $expectedPosition, unable to convert value for '$name' to an integer, got '$asString'")
    }
  }

  private def validateCommandLineArgumentString(expectedPosition: Int, name: String): String = {
    if (commandLineArguments.size < expectedPosition + 1) {
      throw new RuntimeException(s"In command line arguments at position $expectedPosition, expected '$name', was missing")
    } else {
      commandLineArguments(expectedPosition)
    }
  }

}
