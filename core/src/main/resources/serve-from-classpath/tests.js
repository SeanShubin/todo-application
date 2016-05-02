define(['qunit', 'tasks', 'fake-http', 'marshalling', 'node-util', 'text!todo-list-style-showcase.html'],
    function (qunit, createTasks, createHttp, createMarshalling, createNodeUtil, template) {
        'use strict';

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
            var done = assert.async();
            tasks.render().then(function (dom) {
                assert.equal(dom.querySelectorAll('.task-1 .label-task-name')[0].textContent, 'Task A', 'First task found');
                done();
            });
        });
    }
);
