package com.seanshubin.todo.application.domain

import javax.servlet.http.{HttpServletRequest, HttpServletResponse}

import org.eclipse.jetty.server.handler.AbstractHandler
import org.eclipse.jetty.server.{Handler, Request}
import org.scalatest.FunSuite

import scala.collection.mutable.ArrayBuffer

/*
test-driven-002
Going top down, we start with launching the jetty server
We use embedded jetty so we don't have to deal with a container
Containers are the bad kind of inversion of control, they move your logic into places that are hard to test, such as entry points
It is also common to find dispatch logic in containers that is hard to test without spinning up a container or doing a component scan each time

Looking at the design of Jetty's Server class, at first glance it seems that we have to add an boundary test here
However the principle benefit of test driven design is that the logic tests get harder write when the design is bad
Instead of caving in to a boundary test, lets fix the design
Place the hard-to-test Server behind a contract, here called ServerContract
Place the hard-to-test constructor for Server behind another contract, here a first class function that is given a port and returns a ServerContract
We don't want to expose test-only methods to the implementation, and type casts are ugly, so wrap all this up neatly in the JettyServerFixture class
 */
class JettyRunnerTest extends FunSuite {
  test("run jetty server") {
    //given
    val jettyServerFixture = new JettyServerFixture
    val stubHandler = new StubHandler
    val port = 12345
    val jettyRunner: Runnable = new JettyRunner(jettyServerFixture.createJettyServer, stubHandler, port)
    //when
    jettyRunner.run()
    //then
    assert(jettyServerFixture.jettyServer.port === 12345)
    assert(jettyServerFixture.jettyServer.handler === stubHandler)
    assert(jettyServerFixture.jettyServer.invocations == Seq("start", "join"))
  }

  class JettyServerFixture {
    var jettyServer: StubJettyServer = null

    def createJettyServer(port: Int): JettyServerContract = {
      jettyServer = new StubJettyServer(port)
      jettyServer
    }
  }

  class StubJettyServer(val port: Int) extends JettyServerContract {
    var handler: Handler = null
    val invocations = new ArrayBuffer[String]

    override def start(): Unit = invocations.append("start")

    override def setHandler(handler: Handler): Unit = this.handler = handler

    override def join(): Unit = invocations.append("join")
  }

  class StubHandler extends AbstractHandler {
    override def handle(target: String, baseRequest: Request, request: HttpServletRequest, response: HttpServletResponse): Unit = ???
  }

}
