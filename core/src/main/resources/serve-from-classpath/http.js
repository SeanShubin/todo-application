define(() => {
    'use strict';
    var constructor = () => {
        var sendAsync = options => {
            return new Promise(resolve => {
                var client = new XMLHttpRequest();
                var executePromise = () => {
                    if (client.readyState === XMLHttpRequest.DONE) {
                        var response = {status: client.status, body: client.responseText};
                        resolve(response);
                    }
                };
                client.open(options.method, options.url);
                client.setRequestHeader("Content-Type", "text/plain; charset=utf-8");
                client.onreadystatechange = executePromise;
                client.send(options.body);
            });
        };
        var contract = {
            sendAsync: sendAsync
        };
        return contract;
    };
    return constructor;
});
