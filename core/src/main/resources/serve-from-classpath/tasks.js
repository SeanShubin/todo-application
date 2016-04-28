define(['text!./template.html', './http', './marshalling', './tasks', './node-util'], function (template, http, marshalling, tasks, nodeUtil) {
    var body, addButton, clearButton, userInput, list, todoEntryTemplate, itemsListElement;

    function renderTemplateFromHttpResponse(response) {
        var lines = marshalling.stringToLines(response.body);
        var tasks = lines.map(parseTaskLine);
        removeTasksFromGui();
        for (task of tasks) {
            addTaskToGui(task);
        }
    }

    function removeTasksFromGui() {
        while (itemsListElement.firstChild) {
            itemsListElement.removeChild(itemsListElement.firstChild);
        }
    }

    function parseTaskLine(line) {
        var regex = /(\d+) (true|false) (.*)/;
        var parts = regex.exec(line);
        var id = marshalling.stringToInt(parts[1]);
        var done = marshalling.stringToBoolean(parts[2]);
        var name = parts[3];
        var task = {
            id: id,
            done: done,
            name: name
        };
        return task;
    }

    function createTaskElement(options) {
        var node = options.template.cloneNode(true);
        var nameNode = nodeUtil.classNameToSingleElement({node: node, className: 'todo-name'});
        nameNode.innerHTML = options.task.name;
        return node;
    }

    function getTasks() {
        return http.getAsync({url: 'database/task'});
    }

    function addButtonClick() {
        var newTaskName = userInput.value;
        if (userInput.value !== '') {
            userInput.value = '';
            userInput.focus();
            addTask(newTaskName);
        }
    }

    function userInputKeyUp(event) {
        if (event.which === 13) {
            addButtonClick();
        }
    }

    function addTask(newTaskName) {
        var command = 'add ' + newTaskName;
        var request = {url: 'database/task-event', body: command};

        function updateGui(response) {
            var task = parseTaskLine(response.body);
            addTaskToGui(task)
        }

        http.postAsync(request).then(updateGui);
    }

    function addTaskToGui(task) {
        var taskElement = createTaskElement({template: todoEntryTemplate, task: task});
        taskElement.classList.add('task-' + task.id);
        var doneCheckbox = nodeUtil.classNameToSingleElement({node: taskElement, className: 'todo-done'});
        doneCheckbox.checked = task.done;
        function doneCheckboxPressed() {
            var commandPrefix;
            if (doneCheckbox.checked) {
                commandPrefix = 'done';
            } else {
                commandPrefix = 'undone';
            }
            var command = commandPrefix + ' ' + task.id;
            var request = {url: 'database/task-event', body: command};
            http.postAsync(request);
        }

        doneCheckbox.addEventListener('change', doneCheckboxPressed);
        itemsListElement.appendChild(taskElement);
    }

    function refreshTasks() {
        return getTasks().then(renderTemplateFromHttpResponse);
    }

    function setupEventHandling() {
        addButton.addEventListener("click", addButtonClick);
        userInput.addEventListener("keyup", userInputKeyUp);
        clearButton.addEventListener("click", clearButtonClick)
    }

    function lookupNodeByClass(className) {
        return nodeUtil.classNameToSingleElement({node: body, className: className});
    }

    function clearButtonClick() {
        var request = {url: 'database/task-event', body: 'clear'};
        userInput.focus();
        http.postAsync(request).then(refreshTasks);
    }

    return {
        renderAt: function (attachTo) {
            body = attachTo;
            body.innerHTML = template;
            addButton = lookupNodeByClass('add-todo-entry-button');
            clearButton = lookupNodeByClass('todo-clear-done');
            userInput = lookupNodeByClass('user-input');
            list = lookupNodeByClass('todo-entries-list');
            itemsListElement = lookupNodeByClass('todo-entries-list');
            todoEntryTemplate = lookupNodeByClass('todo-entry');
            todoEntryTemplate.remove();
            setupEventHandling();
            refreshTasks();
        }
    };
});
