define([
        'tasks',
        'http',
        'marshalling',
        'node-util',
        'text!todo-list-style-showcase.html'],
    (createTasks,
     createHttp,
     createMarshalling,
     createNodeUtil,
     template) => {
        'use strict';
        var http = createHttp();
        var tasks = createTasks({
            http: http,
            marshalling: createMarshalling(),
            nodeUtil: createNodeUtil(),
            template: template
        });
        var appendRenderedTasks = dom => {
            document.body.appendChild(dom);
        };
        tasks.render().then(appendRenderedTasks);
    }
);
