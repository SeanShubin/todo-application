define(['qunit', 'tasks', 'fake-http', 'marshalling', 'node-util', 'text!todo-list-style-showcase.html'],
    (qunit, createTasks, createHttp, createMarshalling, createNodeUtil, template) => {
        'use strict';

        var selectExactlyOne = (dom, selector) => {
            var nodes = dom.querySelectorAll(selector);
            if (nodes.length === 1) {
                return nodes[0];
            } else {
                throw 'Expected exactly one match for ' + selector + ' got ' + nodes.length;
            }
        };

        var howManyExist = (dom, selector) => {
            var nodes = dom.querySelectorAll(selector);
            return nodes.length;
        };

        var isChecked = (dom, selector) => {
            return dom.querySelectorAll(selector + ':checked').length === 1
        };

        var createHelper = () => {
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
            var dom;
            var render = () => {
                return tasks.render().then(renderedDom => dom = renderedDom)
            };
            var userPressesAddTaskButton = () => {
                return tasks.addButtonClick();
            };
            var userTypesTaskName = taskName => {
                selectExactlyOne(dom, '.input-task-name').value = taskName;
            };
            var addHttpCall = requestResponsePair => {
                http.addRequestResponsePair(requestResponsePair);
            };
            var tasksDisplayedToUser = () => {
                console.log(dom);
                return [];
            };
            var contract = {
                render: render,
                userTypesTaskName: userTypesTaskName,
                addRequestResponsePair: http.addRequestResponsePair,
                userPressesAddTaskButton: userPressesAddTaskButton,
                tasksDisplayedToUser: tasksDisplayedToUser,
                unconsumedRequestResponsePairs: http.unconsumedRequestResponsePairs,
                getDom: () => {
                    return dom;
                }
            };
            return contract;
        };

        qunit.test("render empty", assert => {
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
            assert.expect(7);
            var done = assert.async();
            tasks.render().then(dom => {
                assert.equal(dom.querySelectorAll('.list-item-task').length, 0, 'No tasks');
                assert.equal(http.unconsumedRequestResponsePairs().length, 0, 'No unconsumed http requests');
                assert.equal(selectExactlyOne(dom, 'h1').textContent, 'Todo List', 'title');
                assert.equal(selectExactlyOne(dom, '.input-task-name').value, '', 'task name starts out empty');
                assert.equal(selectExactlyOne(dom, '.button-add-task').innerText, 'Add Task', 'add task button exists');
                assert.equal(howManyExist(dom, '.list-tasks'), 1, 'task list exists');
                assert.equal(selectExactlyOne(dom, '.button-clear-done').innerText, 'Clear Done', 'clear done button exists');
                done();
            });
        });

        qunit.test("render tasks", assert => {
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
                assert.equal(selectExactlyOne(dom, '.task-1 .label-task-name').textContent, 'Task A', 'Task A found');
                assert.notOk(isChecked(dom, '.task-1 .checkbox-task-done'), 'Task A not checked');
                assert.equal(selectExactlyOne(dom, '.task-2 .label-task-name').textContent, 'Task B', 'Task B found');
                assert.ok(isChecked(dom, '.task-2 .checkbox-task-done'), 'Task B checked');
                assert.equal(selectExactlyOne(dom, '.task-3 .label-task-name').textContent, 'Task C', 'Task C found');
                assert.notOk(isChecked(dom, '.task-3 .checkbox-task-done'), 'Task C not checked');
                assert.equal(http.unconsumedRequestResponsePairs().length, 0, 'No unconsumed http requests');
                done();
            });
        });

        qunit.test("add item", assert => {
            var helper = createHelper();
            var addUser = () => {
                helper.userTypesTaskName('Some Task');
                helper.addRequestResponsePair({
                    request: {
                        url: 'database/task-event',
                        method: 'POST',
                        body: 'add Some Task'
                    },
                    response: {
                        status: 201,
                        body: '1 false Some Task'
                    }
                });
                return helper.userPressesAddTaskButton();
            };
            assert.expect(2);
            var done = assert.async();
            var verify = () => {
                console.log(helper.getDom());
                assert.deepEqual(helper.tasksDisplayedToUser(), {id: 1, name: 'Some Task', done: false}, 'Added task');
                assert.equal(helper.unconsumedRequestResponsePairs().length, 0, 'No unconsumed http requests');
                done();
            };
            helper.render().then(addUser).then(verify);
        });
    }
);
