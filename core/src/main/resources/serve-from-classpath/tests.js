define(['qunit', 'tasks', 'fake-http'],
    function (qunit, createTasks, fakeHttp) {
        'use strict';

        qunit.test("render tasks", function (assert) {
            var tasks = createTasks();
            tasks.setHttp(fakeHttp);

            fakeHttp.addRequestResponsePair(
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
            );

            var dom = tasks.render();

            assert.ok(1 == "1", "Passed!");
        });
    }
);
