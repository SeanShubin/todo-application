/*
 test-driven-008
 Test drive the javascript as well
 Since all of the require.js modules expose constructors rather than implementations
 I have an opportunity to override the collaborators with stubs/fakes/mocks
 I also rely on a "helper" class to make the tests easier to understand at a high level
 by delegating low level details to the helper

 Notice that the implementation gets its html from design showcase rather than templates
 This ensures that the appearance matches what the customer agreed to

 Using a fake persistence api for the tasks allows us to decouple http concerns from gui concerns.
 */

define(['qunit', 'tasks', 'marshalling', 'node-util', 'text!todo-list-style-showcase.html'],
    (qunit, createTasks, createMarshalling, createNodeUtil, template) => {
        'use strict';
        qunit.module('task');

        var createTasksPersistenceApi = () => {
            var tasks = [];
            var addResult;
            var undoneInvocations = [];
            var clearInvocationCount = 0;
            var doneInvocations = [];
            var addInvocations = [];
            return {
                list: () => {
                    return Promise.resolve(tasks);
                },
                add: name => {
                    addInvocations.push(name);
                    return Promise.resolve(addResult);
                },
                undone: id => {
                    undoneInvocations.push(id);
                },
                done: id => {
                    doneInvocations.push(id);
                },
                clear: () => {
                    clearInvocationCount++;
                    return Promise.resolve();
                },
                addSampleTask: task => tasks.push(task),
                setSampleAddResult: result => {
                    addResult = result
                },
                clearInvocationCount: () => {
                    return clearInvocationCount
                },
                doneInvocations: () => {
                    return doneInvocations
                },
                undoneInvocations: () => {
                    return undoneInvocations
                },
                addInvocations: () => {
                    return addInvocations
                }
            };
        };
        var marshalling = createMarshalling();
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
            var tasksPersistenceApi = createTasksPersistenceApi();
            var nodeUtil = createNodeUtil();
            var tasks = createTasks({
                tasksPersistenceApi: tasksPersistenceApi,
                nodeUtil: nodeUtil,
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
                userPressesAddTaskButton: userPressesAddTaskButton,
                userPressesClearDoneButton: userPressesClearDoneButton,
                userTogglesDoneCheckboxForId: userTogglesDoneCheckboxForId,
                userPressesKey: userPressesKey,
                tasksDisplayedToUser: tasksDisplayedToUser,
                tasksPersistenceApi: tasksPersistenceApi
            };
            return contract;
        };

        qunit.test("render empty", assert => {
            var helper = createHelper();
            assert.expect(7);
            var done = assert.async();
            var verify = dom => {
                assert.equal(dom.querySelectorAll('.list-item-task').length, 0, 'No tasks');
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
            helper.tasksPersistenceApi.addSampleTask({
                "done": false,
                "id": 1,
                "name": "Task A"
            });
            helper.tasksPersistenceApi.addSampleTask({
                "done": true,
                "id": 2,
                "name": "Task B"
            });
            helper.tasksPersistenceApi.addSampleTask({
                "done": false,
                "id": 3,
                "name": "Task C"
            });
            assert.expect(1);
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
                done();
            };
            helper.render().then(verify);
        });

        qunit.test("add item using button", assert => {
            var helper = createHelper();
            helper.tasksPersistenceApi.setSampleAddResult({
                id: 1,
                name: 'Some Task',
                done: false
            });
            var addUser = () => {
                helper.userTypesTaskName('Some Task');
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
                assert.deepEqual(helper.tasksPersistenceApi.addInvocations(), ['Some Task'], 'add invoked');
                done();
            };
            helper.render().then(addUser).then(verify);
        });

        qunit.test("add item using enter key", assert => {
            var helper = createHelper();
            helper.tasksPersistenceApi.setSampleAddResult({
                id: 1,
                name: 'Some Task',
                done: false
            });
            var enterKey = 13;
            var addUser = () => {
                helper.userTypesTaskName('Some Task');
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
                assert.deepEqual(helper.tasksPersistenceApi.addInvocations(), ['Some Task'], 'add invoked');
                done();
            };
            helper.render().then(addUser).then(verify);
        });

        qunit.test("clear all tasks that are done", assert => {
            var helper = createHelper();
            helper.tasksPersistenceApi.addSampleTask({
                "done": false,
                "id": 1,
                "name": "This is not done"
            });
            var clearDone = () => {
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
                assert.equal(helper.tasksPersistenceApi.clearInvocationCount(), 1, 'clear invoked')
                done();
            };
            helper.render().then(clearDone).then(verify);
        });

        qunit.test("set done", assert => {
            var helper = createHelper();
            helper.tasksPersistenceApi.addSampleTask({
                id: 1,
                name: 'This started out not done',
                done: false
            });
            var setDone = () => {
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
                assert.deepEqual(helper.tasksPersistenceApi.doneInvocations(), [1], 'done invoked')
                done();
            };
            helper.render().then(setDone).then(verify);
        });

        qunit.test("unset done", assert => {
            var helper = createHelper();
            helper.tasksPersistenceApi.addSampleTask({
                id: 1,
                name: 'This started out done',
                done: true
            });
            var setDone = () => {
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
                assert.deepEqual(helper.tasksPersistenceApi.undoneInvocations(), [1], 'undone invoked')
                done();
            };
            helper.render().then(setDone).then(verify);
        });
    }
);
