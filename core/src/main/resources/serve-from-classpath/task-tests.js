/*
 test-driven-008
 Test drive the javascript as well
 Since all of the require.js modules expose constructors rather than implementations
 I have an opportunity to override the collaborators with stubs/fakes/mocks
 I also rely on a "helper" class to make the tests easier to understand at a high level
 by delegating low level details to the helper

 Notice that the implementation gets its html from design showcase rather than templates
 This ensures that the appearance matches what the customer agreed to

 Although it is not complete yet, the sample http requests/responses will eventually come from a separate "specification" project
 This ensures that when the contract between the application and the database changes, there are tests that catch the mismatch
 */

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

        var toggleCheckbox = checkbox => {
            checkbox.checked = !checkbox.checked;
            var event = document.createEvent("HTMLEvents");
            event.initEvent("change", false, true);
            return checkbox.dispatchEvent(event);
        };

        var sendKeyUp = (target, key) => {
            var event = document.createEvent("HTMLEvents");
            event.initEvent("keyup", false, true);
            event.which = key;
            return target.dispatchEvent(event);
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
            var userPressesClearDoneButton = () => {
                return tasks.clearButtonClick();
            };
            var userTogglesDoneCheckboxForId = id => {
                var element = selectExactlyOne(dom, '[data-id="' + id + '"] .checkbox-task-done');
                return toggleCheckbox(element);
            };
            var userTypesTaskName = taskName => {
                selectExactlyOne(dom, '.input-task-name').value = taskName;
            };
            var userPressesKey = whichKey => {
                var element = selectExactlyOne(dom, '.input-task-name');
                return sendKeyUp(element, whichKey);
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
                userPressesClearDoneButton: userPressesClearDoneButton,
                userTogglesDoneCheckboxForId: userTogglesDoneCheckboxForId,
                userPressesKey: userPressesKey,
                tasksDisplayedToUser: tasksDisplayedToUser,
                unconsumedRequestResponsePairs: http.unconsumedRequestResponsePairs
            };
            return contract;
        };

        qunit.test("render empty", assert => {
            var helper = createHelper();
            helper.addRequestResponsePair(httpGetNoTasks);
            assert.expect(8);
            var done = assert.async();
            var verify = dom => {
                assert.equal(dom.querySelectorAll('.list-item-task').length, 0, 'No tasks');
                assert.equal(helper.unconsumedRequestResponsePairs().length, 0, 'No unconsumed http requests');
                assert.equal(selectExactlyOne(dom, 'h1').textContent, 'Todo List', 'title');
                assert.equal(selectExactlyOne(dom, '.input-task-name').value, '', 'task name starts out empty');
                assert.equal(selectExactlyOne(dom, '.button-add-task').innerText, 'Add Task', 'add task button exists');
                assert.equal(howManyExist(dom, '.list-tasks'), 1, 'task list exists');
                assert.equal(selectExactlyOne(dom, '.button-clear-done').innerText, 'Clear Done', 'clear done button exists');
                assert.deepEqual(helper.tasksDisplayedToUser(), [], 'Added task');
                done();
            };
            helper.render().then(verify);
        });

        qunit.test("render tasks", assert => {
            var helper = createHelper();
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
            helper.addRequestResponsePair(httpGetThreeSampleTasks);
            assert.expect(2);
            var done = assert.async();
            var verify = dom => {
                assert.deepEqual(helper.tasksDisplayedToUser(), [{
                    id: 1,
                    name: 'Task A',
                    done: false
                }, {
                    id: 2,
                    name: 'Task B',
                    done: true
                }, {
                    id: 3,
                    name: 'Task C',
                    done: false
                }], 'All three sample tasks found');
                assert.equal(helper.unconsumedRequestResponsePairs().length, 0, 'No unconsumed http requests');
                done();
            };
            helper.render().then(verify);
        });

        qunit.test("add item using button", assert => {
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

        qunit.test("add item using enter key", assert => {
            var helper = createHelper();
            helper.addRequestResponsePair(httpGetNoTasks);
            var enterKey = 13;
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
                return helper.userPressesKey(enterKey);
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

        qunit.test("clear done", assert => {
            var helper = createHelper();
            var taskDoneAndTaskNotDone = {
                request: {
                    url: 'database/task',
                    method: 'GET'
                },
                response: {
                    status: 200,
                    body: '1 false This is not done\n2 true This is done'
                }
            };
            helper.addRequestResponsePair(taskDoneAndTaskNotDone);
            var clearDone = () => {
                helper.addRequestResponsePair({
                    request: {
                        url: 'database/task-event',
                        method: 'POST',
                        body: 'clear'
                    },
                    response: {
                        status: 200
                    }
                });
                helper.addRequestResponsePair({
                    request: {
                        url: 'database/task',
                        method: 'GET'
                    },
                    response: {
                        status: 200,
                        body: '1 false This is not done'
                    }
                });
                return helper.userPressesClearDoneButton();
            };
            assert.expect(2);
            var done = assert.async();
            var verify = () => {
                assert.deepEqual(helper.tasksDisplayedToUser(), [{
                    id: 1,
                    name: 'This is not done',
                    done: false
                }], 'Done task cleared');
                assert.equal(helper.unconsumedRequestResponsePairs().length, 0, 'No unconsumed http requests');
                done();
            };
            helper.render().then(clearDone).then(verify);
        });

        qunit.test("set done", assert => {
            var helper = createHelper();
            var taskDoneAndTaskNotDone = {
                request: {
                    url: 'database/task',
                    method: 'GET'
                },
                response: {
                    status: 200,
                    body: '1 false This started out not done'
                }
            };
            helper.addRequestResponsePair(taskDoneAndTaskNotDone);
            var setDone = () => {
                helper.addRequestResponsePair({
                    request: {
                        url: 'database/task-event',
                        method: 'POST',
                        body: 'done 1'
                    },
                    response: {
                        status: 200
                    }
                });
                return helper.userTogglesDoneCheckboxForId(1);
            };
            assert.expect(2);
            var done = assert.async();
            var verify = () => {
                assert.deepEqual(helper.tasksDisplayedToUser(), [{
                    id: 1,
                    name: 'This started out not done',
                    done: true
                }], 'Done toggled to true');
                assert.equal(helper.unconsumedRequestResponsePairs().length, 0, 'No unconsumed http requests');
                done();
            };
            helper.render().then(setDone).then(verify);
        });

        qunit.test("unset done", assert => {
            var helper = createHelper();
            var taskDoneAndTaskNotDone = {
                request: {
                    url: 'database/task',
                    method: 'GET'
                },
                response: {
                    status: 200,
                    body: '1 true This started out done'
                }
            };
            helper.addRequestResponsePair(taskDoneAndTaskNotDone);
            var setDone = () => {
                helper.addRequestResponsePair({
                    request: {
                        url: 'database/task-event',
                        method: 'POST',
                        body: 'undone 1'
                    },
                    response: {
                        status: 200
                    }
                });
                return helper.userTogglesDoneCheckboxForId(1);
            };
            assert.expect(2);
            var done = assert.async();
            var verify = () => {
                assert.deepEqual(helper.tasksDisplayedToUser(), [{
                    id: 1,
                    name: 'This started out done',
                    done: false
                }], 'Done toggled to false');
                assert.equal(helper.unconsumedRequestResponsePairs().length, 0, 'No unconsumed http requests');
                done();
            };
            helper.render().then(setDone).then(verify);
        });
    }
);
