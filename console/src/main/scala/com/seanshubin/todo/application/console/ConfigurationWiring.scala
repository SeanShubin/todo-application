package com.seanshubin.todo.application.console

import java.nio.charset.{Charset, StandardCharsets}
import java.nio.file.Path

import com.seanshubin.todo.application.contract.{ClassLoaderContract, ClassLoaderDelegate, FilesContract, FilesDelegate}
import com.seanshubin.todo.application.core._
import org.eclipse.jetty.server.Handler

trait ConfigurationWiring {
  def configuration: Configuration

  lazy val serveFromClasspathPrefix: String = "serve-from-classpath"
  lazy val serveFromDirectory: Path = configuration.serveFromDirectory
  lazy val charset: Charset = StandardCharsets.UTF_8
  lazy val contentTypeByExtension: Map[String, ContentType] = Map(
    ".js" -> ContentType("text/javascript", Some(charset)),
    ".css" -> ContentType("text/css", Some(charset)),
    ".txt" -> ContentType("text/plain", Some(charset)),
    ".html" -> ContentType("text/html", Some(charset)),
    ".ico" -> ContentType("image/x-icon", None)
  )
  lazy val redirects: Map[String, String] = Map(
    "/" -> "/index.html"
  )
  lazy val classLoader: ClassLoader = getClass.getClassLoader
  lazy val classLoaderContract: ClassLoaderContract = new ClassLoaderDelegate(classLoader)
  lazy val files: FilesContract = FilesDelegate
  lazy val redirectHandler: ValueHandler = new RedirectHandler(redirects)
  lazy val fileSystemHandler: ValueHandler = new FileSystemHandler(serveFromDirectory, files, contentTypeByExtension)
  lazy val classPathHandler: ValueHandler = new ClassPathHandler(serveFromClasspathPrefix, classLoaderContract, contentTypeByExtension)
  lazy val compositeHandler: ValueHandler = new CompositeHandler(redirectHandler, fileSystemHandler, classPathHandler)
  lazy val handler: Handler = new HandlerAdapter(compositeHandler)
  lazy val runner: Runnable = new JettyRunner(JettyServerDelegate.create, handler, configuration.port)
}
