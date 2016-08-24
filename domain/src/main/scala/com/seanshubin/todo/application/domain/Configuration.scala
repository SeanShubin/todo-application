package com.seanshubin.todo.application.domain

import java.nio.file.Path

case class Configuration(port: Int, databaseApiHost: String, databaseApiPort: Int, serveFromDirectory: Path)
