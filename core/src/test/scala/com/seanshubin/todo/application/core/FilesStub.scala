package com.seanshubin.todo.application.core

import java.nio.file.{LinkOption, Path}

import com.seanshubin.todo.application.contract.FilesNotImplemented

class FilesStub(filesThatExist: Set[String]) extends FilesNotImplemented {
  override def exists(path: Path, options: LinkOption*): Boolean = filesThatExist.contains(path.toString)
}
