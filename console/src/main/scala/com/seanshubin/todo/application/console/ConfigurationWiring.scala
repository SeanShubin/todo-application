package com.seanshubin.todo.application.console

import java.nio.charset.{Charset, StandardCharsets}
import java.nio.file.Path

import com.seanshubin.todo.application.contract.{ClassLoaderContract, ClassLoaderDelegate, FilesContract, FilesDelegate}
import com.seanshubin.todo.application.domain._
import org.eclipse.jetty.server.Handler

trait ConfigurationWiring {
  def configuration: Configuration

  lazy val serveFromClasspathPrefix: String = "serve-from-classpath"
  lazy val serveFromDirectory: Path = configuration.serveFromDirectory
  lazy val charset: Charset = StandardCharsets.UTF_8
  lazy val mimeTypeByExtension: Map[String, String] = Map(
    ".js" -> "text/javascript",
    ".css" -> "text/css",
    ".txt" -> "text/plain",
    ".html" -> "text/html",
    ".ico" -> "image/x-icon"
  )
  lazy val redirects: Map[String, String] = Map(
    "/" -> "/index.html"
  )
  lazy val classLoader: ClassLoader = getClass.getClassLoader
  lazy val classLoaderContract: ClassLoaderContract = new ClassLoaderDelegate(classLoader)
  lazy val files: FilesContract = FilesDelegate
  lazy val redirectHandler: RequestValueHandler = new RedirectHandlerRequest(redirects)
  lazy val fileSystemHandler: RequestValueHandler = new FileSystemHandler(serveFromDirectory, files, mimeTypeByExtension, charset)
  lazy val classPathHandler: RequestValueHandler = new ClassPathHandler(serveFromClasspathPrefix, classLoaderContract, mimeTypeByExtension, charset)
  lazy val httpClient: HttpClient = new GoogleHttpClient
  lazy val forwardingHandler: RequestValueHandler = new ForwardingHandler("/database", configuration.databaseApiHost, configuration.databaseApiPort, httpClient)
  lazy val compositeHandler: RequestValueHandler = new CompositeHandlerRequest(redirectHandler, forwardingHandler, fileSystemHandler, classPathHandler)
  lazy val handler: Handler = new HandlerAdapter(compositeHandler)
  lazy val runner: Runnable = new JettyRunner(JettyServerDelegate.create, handler, configuration.port)
}
