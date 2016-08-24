package com.seanshubin.todo.application.domain

import java.nio.charset.StandardCharsets
import java.nio.file.{LinkOption, Path, Paths}

import com.seanshubin.todo.application.contract.FilesNotImplemented
import org.scalatest.FunSuite

/*
test-driven-007
Finally we can start writing the html/javascript/css frontend
But we will soon notice that since we are serving from the class path, we have to rebuild the app each time we make a change.
This won't do, so lets check the filesystem first, then the classpath
*/
class FileSystemHandlerTest extends FunSuite {
  val charset = StandardCharsets.UTF_8

  test("load from file system") {
    //given
    val fileSystemHandler = createFileSystemHandler(Some(FilePathAndContent(Paths.get("/hello.txt"), "Hello, world!")))
    val request = RequestValue.path("/hello.txt")
    //when
    val Some(response) = fileSystemHandler.handle(request)
    //then
    assert(response.statusCode === 200)
    assert(response.headers.entries === Seq("Content-Type" -> "text/plain; charset=UTF-8"))
    assert(response.bytes === "Hello, world!".getBytes(charset))
  }

  test("not found in file system") {
    //given
    val fileSystemHandler = createFileSystemHandler(None)
    val request = RequestValue.path("/does-not-exist.txt")
    //when
    val maybeResponse = fileSystemHandler.handle(request)
    //then
    assert(maybeResponse === None)
  }

  test("content type not registered for extension") {
    //given
    val fileSystemHandler = createFileSystemHandler(Some(FilePathAndContent(Paths.get("/unusual-extension.xhtml"), "hello")))
    val request = RequestValue.path("/unusual-extension.xhtml")
    //when
    val exception = intercept[RuntimeException] {
      fileSystemHandler.handle(request)
    }
    //then
    assert(exception.getMessage === "Unable to find content type for extension .xhtml")
  }

  test("no extension") {
    //given
    val fileSystemHandler = createFileSystemHandler(Some(FilePathAndContent(Paths.get("/hello"), "hello")))
    val request = RequestValue.path("/hello")
    //when
    val exception = intercept[RuntimeException] {
      fileSystemHandler.handle(request)
    }
    //then
    assert(exception.getMessage === "Unable to find extension for /hello (needed to compute content type)")
  }

  def createFileSystemHandler(maybeFile: Option[FilePathAndContent]): FileSystemHandler = {
    val directory = Paths.get("resources/serve-from-classpath")
    val filesContract = new StubFiles(maybeFile)
    val mimeTypeByExtension = Map(".txt" -> "text/plain")
    new FileSystemHandler(directory, filesContract, mimeTypeByExtension, charset)
  }

  class StubFiles(maybeFile: Option[FilePathAndContent]) extends FilesNotImplemented {
    override def exists(path: Path, options: LinkOption*): Boolean = maybeFile.isDefined

    override def readAllBytes(path: Path): Seq[Byte] = maybeFile.get.content.getBytes(charset)
  }

  case class FilePathAndContent(path: Path, content: String)

}
