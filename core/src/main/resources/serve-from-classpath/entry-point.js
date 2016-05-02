define([
        'tasks',
        'fake-http',
        'marshalling',
        'node-util',
        'text!todo-list-style-showcase.html'],
    function (createTasks,
              createHttp,
              createMarshalling,
              createNodeUtil,
              template) {
        var http = createHttp([
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
        ]);
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
