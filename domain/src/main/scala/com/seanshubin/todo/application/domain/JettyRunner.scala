package com.seanshubin.todo.application.domain

import org.eclipse.jetty.server.Handler

class JettyRunner(createJettyServer: Int => JettyServerContract, handler: Handler, port: Int) extends Runnable {
  override def run(): Unit = {
    val jettyServer = createJettyServer(port)
    jettyServer.setHandler(handler)
    jettyServer.start()
    jettyServer.join()
  }
}
