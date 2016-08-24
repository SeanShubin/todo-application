package com.seanshubin.todo.application.domain

import org.eclipse.jetty.server.Handler

trait JettyServerContract {
  def start()

  def join()

  def setHandler(handler: Handler)
}
