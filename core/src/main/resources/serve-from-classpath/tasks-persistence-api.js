define([], () => {
    'use strict';
    var constructor = collaborators => {
        var http = collaborators.http;
        var marshalling = collaborators.marshalling;

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

        var responseToTasks = response => {
            var lines = marshalling.stringToLines(response.body.trim());
            var tasks = lines.map(parseTaskLine);
            return tasks;
        };

        var list = () => {
            return http.sendAsync({
                method: 'GET',
                url: '/database/task'
            }).then(responseToTasks)
        };

        var add = name => {
        };
        var clear = () => {
        };
        var done = id => {
        };
        var undone = id => {
        };
        var contract = {
            list: list,
            add: add,
            clear: clear,
            done: done,
            undone: undone
        };
        return contract;
    };
    return constructor;
});
