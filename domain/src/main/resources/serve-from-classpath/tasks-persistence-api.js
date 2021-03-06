define([], () => {
    'use strict';
    var constructor = collaborators => {
        //collaborators
        var http = collaborators.http;
        var marshalling = collaborators.marshalling;
        //private
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
        var responseToTask = response => {
            return responseToTasks(response)[0];
        };
        var list = () => {
            return http.sendAsync({
                method: 'GET',
                url: '/database/task'
            }).then(responseToTasks)
        };
        var add = name => {
            return http.sendAsync({
                method: 'POST',
                url: '/database/task-event',
                body: 'add ' + name
            }).then(responseToTask);
        };
        var clear = () => {
            return http.sendAsync({
                method: 'POST',
                url: '/database/task-event',
                body: 'clear'
            });
        };
        var done = id => {
            return http.sendAsync({
                method: 'POST',
                url: '/database/task-event',
                body: 'done ' + id
            })
        };
        var undone = id => {
            return http.sendAsync({
                method: 'POST',
                url: '/database/task-event',
                body: 'undone ' + id
            })
        };
        //public
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
