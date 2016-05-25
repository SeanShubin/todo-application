define([
        'tasks',
        'http',
        'marshalling',
        'node-util',
        'tasks-persistence-api',
        'text!todo-list-style-showcase.html'],
    (createTasks,
     createHttp,
     createMarshalling,
     createNodeUtil,
     createTasksPersistenceApi,
     template) => {
        'use strict';
        var http = createHttp();
        var marshalling = createMarshalling();
        var tasksPersistenceApi = createTasksPersistenceApi({
            http: http,
            marshalling: marshalling
        });
        var nodeUtil = createNodeUtil();
        var tasks = createTasks({
            tasksPersistenceApi: tasksPersistenceApi,
            nodeUtil: nodeUtil,
            template: template
        });
        var appendRenderedTasks = dom => {
            document.body.appendChild(dom);
        };
        tasks.render().then(appendRenderedTasks);
    }
);
