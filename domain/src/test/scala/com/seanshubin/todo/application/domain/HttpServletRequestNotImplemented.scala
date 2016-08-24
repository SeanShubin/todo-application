package com.seanshubin.todo.application.domain

import java.io.BufferedReader
import java.security.Principal
import java.util
import java.util.Locale
import javax.servlet.http.{HttpSession, _}
import javax.servlet.{ServletInputStream, ServletResponse, _}

class HttpServletRequestNotImplemented extends HttpServletRequest {
  override def isRequestedSessionIdFromURL: Boolean = ???

  override def getRemoteUser: String = ???

  override def getUserPrincipal: Principal = ???

  override def getParts: util.Collection[Part] = ???

  override def getHeaderNames: util.Enumeration[String] = ???

  override def getPathInfo: String = ???

  override def getAuthType: String = ???

  override def getRequestURL: StringBuffer = ???

  override def getCookies: Array[Cookie] = ???

  override def getQueryString: String = ???

  override def getPart(name: String): Part = ???

  override def getContextPath: String = ???

  override def getServletPath: String = ???

  override def getRequestURI: String = ???

  override def getPathTranslated: String = ???

  override def getIntHeader(name: String): Int = ???

  override def getHeaders(name: String): util.Enumeration[String] = ???

  override def changeSessionId(): String = ???

  override def authenticate(response: HttpServletResponse): Boolean = ???

  override def getRequestedSessionId: String = ???

  override def logout(): Unit = ???

  override def isRequestedSessionIdFromUrl: Boolean = ???

  override def upgrade[T <: HttpUpgradeHandler](handlerClass: Class[T]): T = ???

  override def isRequestedSessionIdValid: Boolean = ???

  override def getSession(create: Boolean): HttpSession = ???

  override def getSession: HttpSession = ???

  override def getMethod: String = ???

  override def getDateHeader(name: String): Long = ???

  override def isUserInRole(role: String): Boolean = ???

  override def isRequestedSessionIdFromCookie: Boolean = ???

  override def login(username: String, password: String): Unit = ???

  override def getHeader(name: String): String = ???

  override def getParameter(name: String): String = ???

  override def getRequestDispatcher(path: String): RequestDispatcher = ???

  override def isAsyncStarted: Boolean = ???

  override def startAsync(): AsyncContext = ???

  override def startAsync(servletRequest: ServletRequest, servletResponse: ServletResponse): AsyncContext = ???

  override def getRealPath(path: String): String = ???

  override def getLocale: Locale = ???

  override def getRemoteHost: String = ???

  override def getParameterNames: util.Enumeration[String] = ???

  override def isSecure: Boolean = ???

  override def getLocalPort: Int = ???

  override def getContentLengthLong: Long = ???

  override def getAttribute(name: String): AnyRef = ???

  override def removeAttribute(name: String): Unit = ???

  override def getLocalAddr: String = ???

  override def getAsyncContext: AsyncContext = ???

  override def getCharacterEncoding: String = ???

  override def setCharacterEncoding(env: String): Unit = ???

  override def getParameterValues(name: String): Array[String] = ???

  override def getRemotePort: Int = ???

  override def getServerName: String = ???

  override def getProtocol: String = ???

  override def getLocales: util.Enumeration[Locale] = ???

  override def getAttributeNames: util.Enumeration[String] = ???

  override def setAttribute(name: String, o: scala.Any): Unit = ???

  override def getRemoteAddr: String = ???

  override def getLocalName: String = ???

  override def getDispatcherType: DispatcherType = ???

  override def getContentLength: Int = ???

  override def getServerPort: Int = ???

  override def getContentType: String = ???

  override def getReader: BufferedReader = ???

  override def isAsyncSupported: Boolean = ???

  override def getServletContext: ServletContext = ???

  override def getScheme: String = ???

  override def getParameterMap: util.Map[String, Array[String]] = ???

  override def getInputStream: ServletInputStream = ???
}
