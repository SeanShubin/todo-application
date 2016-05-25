define([], () => {
    'use strict';
    var constructor = collaborators => {
        var tasksPersistenceApi = collaborators.tasksPersistenceApi;
        var nodeUtil = collaborators.nodeUtil;
        var template = collaborators.template;

        var body, addButton, clearButton, userInput, todoEntryTemplate, itemsListElement;

        var renderTemplateFromTasks = tasks => {
            removeTasksFromGui();
            for (var task of tasks) {
                addTaskToGui(task);
            }
            return Promise.resolve(body);
        };

        var removeTasksFromGui = () => {
            while (itemsListElement.firstChild) {
                itemsListElement.removeChild(itemsListElement.firstChild);
            }
        };

        var createTaskElement = options => {
            var node = options.template.cloneNode(true);
            var nameNode = nodeUtil.classNameToSingleElement({node: node, className: 'label-task-name'});
            nameNode.innerHTML = options.task.name;
            return node;
        };

        var addButtonClick = () => {
            var newTaskName = userInput.value;
            if (userInput.value !== '') {
                userInput.value = '';
                userInput.focus();
                return addTask(newTaskName);
            } else {
                return Promise.reject();
            }
        };

        var userInputKeyUp = event => {
            if (event.which === 13) {
                addButtonClick();
            }
        };

        var addTask = newTaskName => {
            return tasksPersistenceApi.add(newTaskName).then(addTaskToGui);
        };

        var addTaskToGui = task => {
            var taskElement = createTaskElement({template: todoEntryTemplate, task: task});
            taskElement.setAttribute('data-id', task.id);
            var doneCheckbox = nodeUtil.classNameToSingleElement({node: taskElement, className: 'checkbox-task-done'});
            doneCheckbox.checked = task.done;
            var doneCheckboxPressed = () => {
                if (doneCheckbox.checked) {
                    tasksPersistenceApi.done(task.id);
                } else {
                    tasksPersistenceApi.undone(task.id);
                }
            };
            doneCheckbox.addEventListener('change', doneCheckboxPressed);
            itemsListElement.appendChild(taskElement);
        };

        var refreshTasks = () => {
            return tasksPersistenceApi.list().then(renderTemplateFromTasks);
        };

        var setupEventHandling = () => {
            addButton.addEventListener("click", addButtonClick);
            userInput.addEventListener("keyup", userInputKeyUp);
            clearButton.addEventListener("click", clearButtonClick)
        };

        var lookupNodeByClass = className => {
            return nodeUtil.classNameToSingleElement({node: body, className: className});
        };

        var clearButtonClick = () => {
            userInput.focus();
            return tasksPersistenceApi.clear().then(refreshTasks);
        };

        var render = () => {
            body = document.createElement('div');
            body.innerHTML = template;
            addButton = lookupNodeByClass('button-add-task');
            clearButton = lookupNodeByClass('button-clear-done');
            userInput = lookupNodeByClass('input-task-name');
            itemsListElement = lookupNodeByClass('list-tasks');
            todoEntryTemplate = lookupNodeByClass('list-item-task');
            todoEntryTemplate.remove();
            setupEventHandling();
            return refreshTasks();
        };

        var contract = {
            render: render,
            addButtonClick: addButtonClick,
            clearButtonClick: clearButtonClick
        };
        return contract;
    };
    return constructor;
});
