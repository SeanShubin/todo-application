package com.seanshubin.todo.application.core

import java.nio.file.Path

case class Configuration(port: Int, databaseApiHost: String, databaseApiPort: Int, serveFromDirectory: Path)
