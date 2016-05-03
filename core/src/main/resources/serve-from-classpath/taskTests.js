define(['qunit', 'tasks', 'fake-http', 'marshalling', 'node-util', 'text!todo-list-style-showcase.html'],
    function (qunit, createTasks, createHttp, createMarshalling, createNodeUtil, template) {
        'use strict';

        qunit.test("render empty", function (assert) {
            var http = createHttp([
                {
                    request: {
                        url: 'database/task',
                        method: 'GET'
                    },
                    response: {
                        status: 200,
                        body: ''
                    }
                }
            ]);
            var tasks = createTasks({
                http: http,
                marshalling: createMarshalling(),
                nodeUtil: createNodeUtil(),
                template: template
            });
            assert.expect(2);
            var done = assert.async();
            tasks.render().then(dom => {
                // document.body.appendChild(dom);
                assert.equal(dom.querySelectorAll('.list-item-task').length, 0, 'No tasks');
                assert.equal(http.unconsumedRequestResponsePairs().length, 0, 'No unconsumed http requests');
                done();
            });
        });

        qunit.test("render tasks", function (assert) {
            var http = createHttp([
                {
                    request: {
                        url: 'database/task',
                        method: 'GET'
                    },
                    response: {
                        status: 200,
                        body: '1 false Task A\n2 true Task B\n3 false Task C'
                    }
                }
            ]);
            var tasks = createTasks({
                http: http,
                marshalling: createMarshalling(),
                nodeUtil: createNodeUtil(),
                template: template
            });
            assert.expect(8);
            var done = assert.async();
            tasks.render().then(dom => {
                // document.body.appendChild(dom);
                assert.equal(dom.querySelectorAll('.list-item-task').length, 3, '3 tasks');
                assert.equal(dom.querySelectorAll('.task-1 .label-task-name')[0].textContent, 'Task A', 'Task A found');
                assert.equal(dom.querySelectorAll('.task-1 .checkbox-task-done:checked').length, 0, 'Task A not checked');
                assert.equal(dom.querySelectorAll('.task-2 .label-task-name')[0].textContent, 'Task B', 'Task B found');
                assert.equal(dom.querySelectorAll('.task-2 .checkbox-task-done:checked').length, 1, 'Task B checked');
                assert.equal(dom.querySelectorAll('.task-3 .label-task-name')[0].textContent, 'Task C', 'Task C found');
                assert.equal(dom.querySelectorAll('.task-3 .checkbox-task-done:checked').length, 0, 'Task C not checked');
                assert.equal(http.unconsumedRequestResponsePairs().length, 0, 'No unconsumed http requests');
                done();
            });
        });
    }
);
