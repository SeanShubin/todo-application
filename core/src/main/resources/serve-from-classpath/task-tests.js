define(['qunit', 'tasks', 'fake-http', 'marshalling', 'node-util', 'text!todo-list-style-showcase.html'],
    (qunit, createTasks, createHttp, createMarshalling, createNodeUtil, template) => {
        'use strict';
        var marshalling = createMarshalling();
        var httpGetNoTasks = {
            request: {
                url: 'database/task',
                method: 'GET'
            },
            response: {
                status: 200,
                body: ''
            }
        };
        var httpGetThreeSampleTasks = {
            request: {
                url: 'database/task',
                method: 'GET'
            },
            response: {
                status: 200,
                body: '1 false Task A\n2 true Task B\n3 false Task C'
            }
        };
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
            var http = createHttp();
            var tasks = createTasks({
                http: http,
                marshalling: marshalling,
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
            var taskElementToTask = taskElement => {
                var name = selectExactlyOne(taskElement, '.label-task-name').textContent;
                var done = isChecked(taskElement, '.checkbox-task-done');
                var id = marshalling.stringToInt(taskElement.dataset.id);
                return {
                    id: id,
                    name: name,
                    done: done
                };
            };
            var tasksDisplayedToUser = () => {
                var taskElements = dom.querySelectorAll('.list-item-task');
                var tasks = Array.prototype.map.call(taskElements, taskElementToTask);
                return tasks;
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
            var http = createHttp();
            http.addRequestResponsePair(httpGetNoTasks);
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
            var http = createHttp();
            http.addRequestResponsePair(httpGetThreeSampleTasks);
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
                assert.equal(selectExactlyOne(dom, '[data-id="1"] .label-task-name').textContent, 'Task A', 'Task A found');
                assert.notOk(isChecked(dom, '[data-id="1"] .checkbox-task-done'), 'Task A not checked');
                assert.equal(selectExactlyOne(dom, '[data-id="2"] .label-task-name').textContent, 'Task B', 'Task B found');
                assert.ok(isChecked(dom, '[data-id="2"] .checkbox-task-done'), 'Task B checked');
                assert.equal(selectExactlyOne(dom, '[data-id="3"] .label-task-name').textContent, 'Task C', 'Task C found');
                assert.notOk(isChecked(dom, '[data-id="3"] .checkbox-task-done'), 'Task C not checked');
                assert.equal(http.unconsumedRequestResponsePairs().length, 0, 'No unconsumed http requests');
                done();
            });
        });

        qunit.test("add item", assert => {
            var helper = createHelper();
            helper.addRequestResponsePair(httpGetNoTasks);
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
                assert.deepEqual(helper.tasksDisplayedToUser(), [{
                    id: 1,
                    name: 'Some Task',
                    done: false
                }], 'Added task');
                assert.equal(helper.unconsumedRequestResponsePairs().length, 0, 'No unconsumed http requests');
                done();
            };
            helper.render().then(addUser).then(verify);
        });
    }
);
