package com.seanshubin.todo.application.console

import java.nio.charset.{Charset, StandardCharsets}

import com.seanshubin.todo.application.contract.{ClassLoaderContract, ClassLoaderDelegate}
import com.seanshubin.todo.application.core._
import org.eclipse.jetty.server.Handler

trait ConfigurationWiring {
  def configuration: Configuration

  lazy val serveFromClasspathPrefix = "serve-from-classpath"
  lazy val charset: Charset = StandardCharsets.UTF_8
  lazy val contentTypeByExtension: Map[String, ContentType] = Map(
    ".js" -> ContentType("text/javascript", Some(charset)),
    ".css" -> ContentType("text/css", Some(charset)),
    ".txt" -> ContentType("text/plain", Some(charset)),
    ".html" -> ContentType("text/html", Some(charset)),
    ".ico" -> ContentType("image/x-icon", None)
  )
  lazy val classLoader: ClassLoader = getClass.getClassLoader
  lazy val classLoaderContract: ClassLoaderContract = new ClassLoaderDelegate(classLoader)
  lazy val classPathHandler: ValueHandler = new ClassPathHandler(serveFromClasspathPrefix, classLoaderContract, contentTypeByExtension)
  lazy val handler: Handler = new HandlerAdapter(classPathHandler)
  lazy val runner: Runnable = new JettyRunner(JettyServerDelegate.create, handler, configuration.port)
}
