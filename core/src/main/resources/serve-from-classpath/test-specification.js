/*
 test-driven-009
 Now that we know what we need from the persistence api, it is time to design the specification
 Notice that the specification knows nothing about programming languages, it only knows that we are using HTTP 1.1
 Also notice that there is no binary dependency on the persistence layer, only a dependency on the specification
 This separation of concerns allows us to keep each part simpler than it would be if we were trying to ensure no duplication between the projects
 */
define(['qunit', 'http', 'marshalling', 'http-spec-loader', 'fake-http', 'tasks-persistence-api'],
    (qunit, createHttp, createMarshalling, createHttpSpecLoader, createFakeHttp, createTasksPersistenceApi) => {
        'use strict';

        qunit.module('specification');

        var createHelper = () => {
            var http = createHttp();
            var marshalling = createMarshalling();
            var fakeHttp = createFakeHttp();
            var tasksPersistenceApi = createTasksPersistenceApi({
                http: fakeHttp,
                marshalling: marshalling
            });
            var httpSpecLoader = createHttpSpecLoader({
                http: http,
                marshalling: marshalling,
                fakeHttp: fakeHttp
            });
            return {
                httpSpecLoader: httpSpecLoader,
                tasksPersistenceApi: tasksPersistenceApi,
                fakeHttp: fakeHttp
            };
        };

        qunit.test("get tasks", assert => {
            var helper = createHelper();

            assert.expect(11);
            var done = assert.async();
            var verify = tasks => {
                assert.equal(tasks.length, 3, 'tasks.length is 3');
                assert.equal(tasks[0].id, 1, 'tasks[0].id is 1');
                assert.equal(tasks[0].done, false, 'tasks[0].done is false');
                assert.equal(tasks[0].name, 'Task A', 'tasks[0].name is Task A');
                assert.equal(tasks[1].id, 2, 'tasks[1].id is 2');
                assert.equal(tasks[1].done, true, 'tasks[1].done is true');
                assert.equal(tasks[1].name, 'Task B', 'tasks[1].name is Task B');
                assert.equal(tasks[2].id, 3, 'tasks[2].id is 3');
                assert.equal(tasks[2].done, false, 'tasks[2].done is false');
                assert.equal(tasks[2].name, 'Task C', 'tasks[2].name is Task C');
                assert.equal(helper.fakeHttp.unconsumedRequestResponsePairs().length, 0, 'fakeHttp.unconsumedRequestResponsePairs.length is 0');
                done();
            };
            var specPaths = {
                request: 'todo/specification/task/get-task-request.txt',
                response: 'todo/specification/task/get-task-response.txt'
            };
            helper.httpSpecLoader.loadRequestResponse(specPaths).then(helper.tasksPersistenceApi.list).then(verify);
        });

        qunit.test("add task", assert => {
            var helper = createHelper();

            assert.expect(4);
            var done = assert.async();
            var verify = task => {
                assert.equal(task.id, 1, 'task.id is 1');
                assert.equal(task.done, false, 'task.done is false');
                assert.equal(task.name, 'Task A', 'task.name is Task A');
                assert.equal(helper.fakeHttp.unconsumedRequestResponsePairs().length, 0, 'fakeHttp.unconsumedRequestResponsePairs.length is 0');
                done();
            };
            var specPaths = {
                request: 'todo/specification/task-event/post-task-event-add-request.txt',
                response: 'todo/specification/task-event/post-task-event-add-response.txt'
            };
            var addFunction = () => {
                return helper.tasksPersistenceApi.add('Task A');
            };
            helper.httpSpecLoader.loadRequestResponse(specPaths).then(addFunction).then(verify);
        });

        qunit.test("task done", assert => {
            var helper = createHelper();

            assert.expect(1);
            var done = assert.async();
            var verify = () => {
                assert.equal(helper.fakeHttp.unconsumedRequestResponsePairs().length, 0, 'fakeHttp.unconsumedRequestResponsePairs.length is 0');
                done();
            };
            var specPaths = {
                request: 'todo/specification/task-event/post-task-event-done-request.txt',
                response: 'todo/specification/task-event/post-task-event-done-response.txt'
            };
            var taskDoneFunction = () => {
                return helper.tasksPersistenceApi.done(1);
            };
            helper.httpSpecLoader.loadRequestResponse(specPaths).then(taskDoneFunction).then(verify);
        });

        qunit.test("task undone", assert => {
            var helper = createHelper();

            assert.expect(1);
            var done = assert.async();
            var verify = () => {
                assert.equal(helper.fakeHttp.unconsumedRequestResponsePairs().length, 0, 'fakeHttp.unconsumedRequestResponsePairs.length is 0');
                done();
            };
            var specPaths = {
                request: 'todo/specification/task-event/post-task-event-undone-request.txt',
                response: 'todo/specification/task-event/post-task-event-undone-response.txt'
            };
            var taskUndoneFunction = () => {
                return helper.tasksPersistenceApi.undone(1);
            };
            helper.httpSpecLoader.loadRequestResponse(specPaths).then(taskUndoneFunction).then(verify);
        });

        qunit.test("clear tasks", assert => {
            var helper = createHelper();

            assert.expect(1);
            var done = assert.async();
            var verify = () => {
                assert.equal(helper.fakeHttp.unconsumedRequestResponsePairs().length, 0, 'fakeHttp.unconsumedRequestResponsePairs.length is 0');
                done();
            };
            var specPaths = {
                request: 'todo/specification/task-event/post-task-event-clear-request.txt',
                response: 'todo/specification/task-event/post-task-event-clear-response.txt'
            };
            helper.httpSpecLoader.loadRequestResponse(specPaths).then(helper.tasksPersistenceApi.clear).then(verify);
        });
    }
);
