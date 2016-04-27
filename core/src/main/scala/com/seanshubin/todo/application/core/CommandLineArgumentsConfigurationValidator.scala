package com.seanshubin.todo.application.core

import java.nio.file.{Path, Paths}

import com.seanshubin.todo.application.contract.FilesContract

class CommandLineArgumentsConfigurationValidator(commandLineArguments: Seq[String], files: FilesContract) extends ConfigurationValidator {
  override def validate(): Configuration = {
    val port = validateCommandLineArgumentInt(0, "server port")
    val databaseApiHost = validateCommandLineArgumentString(1, "database api host")
    val databaseApiPort = validateCommandLineArgumentInt(2, "database api port")
    val serveFromDirectory = validateCommandLineArgumentPath(3, "serve from directory")
    val configuration = Configuration(
      port = port,
      databaseApiHost = databaseApiHost,
      databaseApiPort = databaseApiPort,
      serveFromDirectory = serveFromDirectory)
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

  private def validateCommandLineArgumentPath(expectedPosition: Int, name: String): Path = {
    val asString = validateCommandLineArgumentString(expectedPosition, name)
    val path = Paths.get(asString)
    if (files.exists(path)) {
      path
    } else {
      throw new RuntimeException(s"In command line arguments at position $expectedPosition, value for '$name' must be a path that exists, got '$path'")
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
