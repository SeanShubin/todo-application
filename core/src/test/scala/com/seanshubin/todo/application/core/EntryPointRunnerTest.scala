package com.seanshubin.todo.application.core

import org.scalatest.FunSuite

/*
test-driven-004
Now that we have configuration and the jetty runner done, it is time to wire everything into the entry point
However, remember that wiring is only allowed specify how all the parts are connected together, it is not allowed to invoke anything
But this seems impossible!
We can't wire everything up without the configuration, and to validate the configuration we must invoke something
This will happen anytime something needs to be wired within a certain lifecycle
In this case, we have the lifecycle of the entire application, from command line invocation to exit
We also have an inner lifecycle that expects to have a valid configuration
So we split the wiring up into two classes, one for each lifecycle
The EntryPointWiring creates a runner that knows how to validate the configuration
This frees up the ConfigurationWiring to assume a valid configuration already exists

Another case you might need to use this technique is when you have wiring that depends on access to an open database connection
*/
class EntryPointRunnerTest extends FunSuite {
  test("properly configured") {
    //given
    val portString = "100"
    val host = "the-host"
    val apiPortString = "200"
    val commandLineArguments = Seq(portString, host, apiPortString)
    val configurationValidator: ConfigurationValidator = new CommandLineArgumentsConfigurationValidator(commandLineArguments)
    val createRunnerFixture = new CreateRunnerFixture
    val runner: Runnable = new EntryPointRunner(configurationValidator, createRunnerFixture.createRunner)
    //when
    runner.run()
    //then
    assert(createRunnerFixture.runnerStub.actualConfiguration === Configuration(100, "the-host", 200))
    assert(createRunnerFixture.runnerStub.invocations === 1)
  }

  class CreateRunnerFixture {
    var runnerStub: RunnerStub = null

    def createRunner(configuration: Configuration): Runnable = {
      runnerStub = new RunnerStub(configuration)
      runnerStub
    }
  }

  class RunnerStub(configuration: Configuration) extends Runnable {
    var invocations = 0
    val actualConfiguration = configuration

    override def run(): Unit = invocations += 1
  }

}
