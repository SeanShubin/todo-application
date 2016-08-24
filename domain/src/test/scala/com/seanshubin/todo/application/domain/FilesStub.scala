package com.seanshubin.todo.application.domain

import java.nio.file.{LinkOption, Path}

import com.seanshubin.todo.application.contract.FilesNotImplemented

class FilesStub(filesThatExist: Set[String]) extends FilesNotImplemented {
  override def exists(path: Path, options: LinkOption*): Boolean = filesThatExist.contains(path.toString)
}
