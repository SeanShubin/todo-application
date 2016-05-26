/*
 test-driven-008
 Test drive the javascript as well
 Since all of the require.js modules expose constructors rather than implementations
 I have an opportunity to override the collaborators with stubs/fakes/mocks
 I also rely on a "helper" class to make the tests easier to understand at a high level
 by delegating low level details to the helper

 Notice that the implementation gets its html from design showcase rather than templates
 This ensures that the appearance matches what the customer agreed to

 Using a stub persistence api for the tasks allows us to decouple http concerns from gui concerns.
 */

define(['qunit', 'tasks', 'marshalling', 'node-util', 'text!todo-list-style-showcase.html'],
    (qunit, createTasks, createMarshalling, createNodeUtil, template) => {
        'use strict';
        qunit.module('task');
        var nodeUtil = createNodeUtil();

        var createStubTasksPersistenceApi = () => {
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

        var createHelper = () => {
            var tasksPersistenceApi = createStubTasksPersistenceApi();
            var marshalling = createMarshalling();
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
                var element = nodeUtil.selectExactlyOne({
                    dom: dom,
                    selector: '[data-id="' + id + '"] .checkbox-task-done'
                });
                return nodeUtil.toggleCheckbox(element);
            };
            var userTypesTaskName = taskName => {
                nodeUtil.selectExactlyOne({dom: dom, selector: '.input-task-name'}).value = taskName;
            };
            var userPressesKey = whichKey => {
                var element = nodeUtil.selectExactlyOne({dom: dom, selector: '.input-task-name'});
                return nodeUtil.sendKeyUp({element: element, key: whichKey});
            };
            var taskElementToTask = taskElement => {
                var name = nodeUtil.selectExactlyOne({dom: taskElement, selector: '.label-task-name'}).textContent;
                var done = nodeUtil.isChecked({dom: taskElement, selector: '.checkbox-task-done'});
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
                assert.equal(nodeUtil.selectExactlyOne({dom: dom, selector: 'h1'}).textContent, 'Todo List', 'title');
                assert.equal(nodeUtil.selectExactlyOne({
                    dom: dom,
                    selector: '.input-task-name'
                }).value, '', 'task name starts out empty');
                assert.equal(nodeUtil.selectExactlyOne({
                    dom: dom,
                    selector: '.button-add-task'
                }).innerText, 'Add Task', 'add task button exists');
                assert.equal(nodeUtil.howManyExist({dom: dom, selector: '.list-tasks'}), 1, 'task list exists');
                assert.equal(nodeUtil.selectExactlyOne({
                    dom: dom,
                    selector: '.button-clear-done'
                }).innerText, 'Clear Done', 'clear done button exists');
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
