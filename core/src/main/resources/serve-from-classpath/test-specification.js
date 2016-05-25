define(['qunit', 'http', 'marshalling', 'http-spec-loader', 'fake-http', 'tasks-persistence-api'],
    (qunit, createHttp, createMarshalling, createHttpSpecLoader, createFakeHttp, createTasksPersistenceApi) => {
        'use strict';

        qunit.module('specification');

        qunit.test("get tasks", assert => {
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
                assert.equal(fakeHttp.unconsumedRequestResponsePairs.length, 0, 'fakeHttp.unconsumedRequestResponsePairs.length is 0');
                done();
            };
            var specPaths = {
                request: 'todo/specification/task/get-task-request.txt',
                response: 'todo/specification/task/get-task-response.txt'
            };
            httpSpecLoader.loadRequestResponse(specPaths).then(tasksPersistenceApi.list).then(verify);
        });
    }
);
