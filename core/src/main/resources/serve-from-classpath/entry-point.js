define([
        'tasks',
        'http',
        'marshalling',
        'node-util',
        'text!todo-list-style-showcase.html'],
    function (createTasks,
              createHttp,
              createMarshalling,
              createNodeUtil,
              template) {
        var http = createHttp();
        var tasks = createTasks({
            http: http,
            marshalling: createMarshalling(),
            nodeUtil: createNodeUtil(),
            template: template
        });
        var appendRenderedTasks = function (dom) {
            document.body.appendChild(dom);
        };
        tasks.render().then(appendRenderedTasks);
    }
);
