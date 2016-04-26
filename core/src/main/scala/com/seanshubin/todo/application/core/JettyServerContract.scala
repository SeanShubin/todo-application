package com.seanshubin.todo.application.core

import org.eclipse.jetty.server.Handler

trait JettyServerContract {
  def start()

  def join()

  def setHandler(handler: Handler)
}
