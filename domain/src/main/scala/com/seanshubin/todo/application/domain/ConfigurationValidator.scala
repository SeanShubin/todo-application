package com.seanshubin.todo.application.domain

trait ConfigurationValidator {
  def validate(): Configuration
}
