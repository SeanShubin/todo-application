define([], () => {
    var constructor = collaborators => {
        var http = collaborators.http;
        var marshalling = collaborators.marshalling;
        var nodeUtil = collaborators.nodeUtil;
        var template = collaborators.template;

        var body, addButton, clearButton, userInput, todoEntryTemplate, itemsListElement;

        var renderTemplateFromHttpResponse = response => {
            var lines = marshalling.stringToLines(response.body);
            var tasks = lines.map(parseTaskLine);
            removeTasksFromGui();
            for (task of tasks) {
                addTaskToGui(task);
            }
            return Promise.resolve(body);
        };

        var removeTasksFromGui = () => {
            while (itemsListElement.firstChild) {
                itemsListElement.removeChild(itemsListElement.firstChild);
            }
        };

        var parseTaskLine = line => {
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

        var createTaskElement = options => {
            var node = options.template.cloneNode(true);
            var nameNode = nodeUtil.classNameToSingleElement({node: node, className: 'label-task-name'});
            nameNode.innerHTML = options.task.name;
            return node;
        };

        var getTasks = () => {
            return http.sendAsync({method: "GET", url: 'database/task'});
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
            var command = 'add ' + newTaskName;
            var request = {method: 'POST', url: 'database/task-event', body: command};

            var updateGui = response => {
                var task = parseTaskLine(response.body);
                addTaskToGui(task)
            };

            return http.sendAsync(request).then(updateGui);
        };

        var addTaskToGui = task => {
            var taskElement = createTaskElement({template: todoEntryTemplate, task: task});
            taskElement.setAttribute('data-id', task.id);
            var doneCheckbox = nodeUtil.classNameToSingleElement({node: taskElement, className: 'checkbox-task-done'});
            doneCheckbox.checked = task.done;
            var doneCheckboxPressed = () => {
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

        var refreshTasks = () => {
            return getTasks().then(renderTemplateFromHttpResponse);
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
            var request = {method: 'POST', url: 'database/task-event', body: 'clear'};
            userInput.focus();
            return http.sendAsync(request).then(refreshTasks);
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
