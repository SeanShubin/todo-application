package com.seanshubin.todo.application.domain

import org.eclipse.jetty.server.{Handler, Server}

class JettyServerDelegate(server: Server) extends JettyServerContract {
  override def start(): Unit = server.start()

  override def join(): Unit = server.join()

  override def setHandler(handler: Handler): Unit = server.setHandler(handler)
}

object JettyServerDelegate {
  def create(port: Int): JettyServerContract = new JettyServerDelegate(new Server(port))
}
