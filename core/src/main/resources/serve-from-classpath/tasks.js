define([
    'text!todo-list-style-showcase.html',
    'fake-http',
    'marshalling',
    'tasks',
    'node-util'], function (template, http, marshalling, tasks, nodeUtil) {
    var body, addButton, clearButton, userInput, todoEntryTemplate, itemsListElement;

    http.addRequestResponsePair(
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
        var nameNode = nodeUtil.classNameToSingleElement({node: node, className: 'label-task-name'});
        nameNode.innerHTML = options.task.name;
        return node;
    }

    function getTasks() {
        return http.sendAsync({method: "GET", url: 'database/task'});
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
        var request = {method: 'POST', url: 'database/task-event', body: command};

        function updateGui(response) {
            var task = parseTaskLine(response.body);
            addTaskToGui(task)
        }

        http.sendAsync(request).then(updateGui);
    }

    function addTaskToGui(task) {
        var taskElement = createTaskElement({template: todoEntryTemplate, task: task});
        taskElement.classList.add('task-' + task.id);
        var doneCheckbox = nodeUtil.classNameToSingleElement({node: taskElement, className: 'checkbox-task-done'});
        doneCheckbox.checked = task.done;
        function doneCheckboxPressed() {
            var commandPrefix;
            if (doneCheckbox.checked) {
                commandPrefix = 'done';
            } else {
                commandPrefix = 'undone';
            }
            var command = commandPrefix + ' ' + task.id;
            var request = {method: 'POST', url: 'database/task-event', body: command};
            http.sendAsync(request);
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
        var request = {method: 'POST', url: 'database/task-event', body: 'clear'};
        userInput.focus();
        http.sendAsync(request).then(refreshTasks);
    }

    return {
        renderAt: function (attachTo) {
            body = attachTo;
            body.innerHTML = template;
            addButton = lookupNodeByClass('button-add-task');
            clearButton = lookupNodeByClass('button-clear-done');
            userInput = lookupNodeByClass('input-task-name');
            itemsListElement = lookupNodeByClass('list-tasks');
            todoEntryTemplate = lookupNodeByClass('list-item-task');
            todoEntryTemplate.remove();
            setupEventHandling();
            refreshTasks();
        }
    };
});
