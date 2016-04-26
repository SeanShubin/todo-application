package com.seanshubin.todo.application.console

import com.seanshubin.todo.application.core.{BoundaryHandler, Configuration, JettyRunner, JettyServerDelegate}
import org.eclipse.jetty.server.Handler

trait ConfigurationWiring {
  def configuration: Configuration

  lazy val handler: Handler = new BoundaryHandler
  lazy val runner: Runnable = new JettyRunner(JettyServerDelegate.create, handler, configuration.port)
}
