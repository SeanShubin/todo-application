define([], function () {
    var constructor = function (collaborators) {
        var http = collaborators.http;
        var marshalling = collaborators.marshalling;
        var nodeUtil = collaborators.nodeUtil;
        var template = collaborators.template;

        var body, addButton, clearButton, userInput, todoEntryTemplate, itemsListElement;

        var renderTemplateFromHttpResponse = function (response) {
            var lines = marshalling.stringToLines(response.body);
            var tasks = lines.map(parseTaskLine);
            removeTasksFromGui();
            for (task of tasks) {
                addTaskToGui(task);
            }
        };

        var removeTasksFromGui = function () {
            while (itemsListElement.firstChild) {
                itemsListElement.removeChild(itemsListElement.firstChild);
            }
        };

        var parseTaskLine = function (line) {
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
        };

        var createTaskElement = function (options) {
            var node = options.template.cloneNode(true);
            var nameNode = nodeUtil.classNameToSingleElement({node: node, className: 'label-task-name'});
            nameNode.innerHTML = options.task.name;
            return node;
        };

        var getTasks = function () {
            return http.sendAsync({method: "GET", url: 'database/task'});
        };

        var addButtonClick = function () {
            var newTaskName = userInput.value;
            if (userInput.value !== '') {
                userInput.value = '';
                userInput.focus();
                addTask(newTaskName);
            }
        };

        var userInputKeyUp = function (event) {
            if (event.which === 13) {
                addButtonClick();
            }
        };

        var addTask = function (newTaskName) {
            var command = 'add ' + newTaskName;
            var request = {method: 'POST', url: 'database/task-event', body: command};

            var updateGui = function (response) {
                var task = parseTaskLine(response.body);
                addTaskToGui(task)
            };

            http.sendAsync(request).then(updateGui);
        };

        var addTaskToGui = function (task) {
            var taskElement = createTaskElement({template: todoEntryTemplate, task: task});
            taskElement.classList.add('task-' + task.id);
            var doneCheckbox = nodeUtil.classNameToSingleElement({node: taskElement, className: 'checkbox-task-done'});
            doneCheckbox.checked = task.done;
            var doneCheckboxPressed = function () {
                var commandPrefix;
                if (doneCheckbox.checked) {
                    commandPrefix = 'done';
                } else {
                    commandPrefix = 'undone';
                }
                var command = commandPrefix + ' ' + task.id;
                var request = {method: 'POST', url: 'database/task-event', body: command};
                http.sendAsync(request);
            };

            doneCheckbox.addEventListener('change', doneCheckboxPressed);
            itemsListElement.appendChild(taskElement);
        };

        var refreshTasks = function () {
            return getTasks().then(renderTemplateFromHttpResponse);
        };

        var setupEventHandling = function () {
            addButton.addEventListener("click", addButtonClick);
            userInput.addEventListener("keyup", userInputKeyUp);
            clearButton.addEventListener("click", clearButtonClick)
        };

        var lookupNodeByClass = function (className) {
            return nodeUtil.classNameToSingleElement({node: body, className: className});
        };

        var clearButtonClick = function () {
            var request = {method: 'POST', url: 'database/task-event', body: 'clear'};
            userInput.focus();
            http.sendAsync(request).then(refreshTasks);
        };

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

    };
    return constructor;

});
