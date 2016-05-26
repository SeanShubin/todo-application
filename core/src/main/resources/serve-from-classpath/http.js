define(() => {
    'use strict';
    var constructor = () => {
        //private
        var sendAsync = options => {
            var method = options.method;
            var url = options.url;
            var body = options.body;
            return new Promise(resolve => {
                var client = new XMLHttpRequest();
                var executePromise = () => {
                    if (client.readyState === XMLHttpRequest.DONE) {
                        var response = {status: client.status, body: client.responseText};
                        resolve(response);
                    }
                };
                client.open(method, url);
                client.setRequestHeader("Content-Type", "text/plain; charset=utf-8");
                client.onreadystatechange = executePromise;
                client.send(body);
            });
        };
        //public
        var contract = {
            sendAsync: sendAsync
        };
        return contract;
    };
    return constructor;
});
