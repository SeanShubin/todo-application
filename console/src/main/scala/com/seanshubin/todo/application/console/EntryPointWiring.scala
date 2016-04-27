package com.seanshubin.todo.application.console

import com.seanshubin.todo.application.contract.{FilesContract, FilesDelegate}
import com.seanshubin.todo.application.core._

trait EntryPointWiring {
  def commandLineArguments: Seq[String]

  lazy val files: FilesContract = FilesDelegate
  lazy val configurationValidator: ConfigurationValidator = new CommandLineArgumentsConfigurationValidator(commandLineArguments, files)
  lazy val createRunner: Configuration => Runnable = (theConfiguration) => new ConfigurationWiring {
    override def configuration: Configuration = theConfiguration
  }.runner
  lazy val runner: Runnable = new EntryPointRunner(configurationValidator, createRunner)
}
