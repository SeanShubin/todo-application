define(function () {
    var constructor = function () {
        return {
            sendAsync: function (options) {
                return new Promise(function (resolve) {
                    var client = new XMLHttpRequest();
                    var executePromise = function () {
                        if (client.readyState === XMLHttpRequest.DONE) {
                            resolve({status: client.status, body: client.responseText});
                        }
                    };
                    client.open(options.method, options.url);
                    client.setRequestHeader("Content-Type", "text/plain; charset=utf-8");
                    client.onreadystatechange = executePromise;
                    client.send(options.body);
                });
            }
        }
    };
    return constructor;
});
