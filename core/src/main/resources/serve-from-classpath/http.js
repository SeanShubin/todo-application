define(function () {
    return function () {
        return {
            getAsync: function (options) {
                return new Promise(function (resolve) {
                    var client = new XMLHttpRequest();
                    client.open("GET", options.url);
                    client.setRequestHeader("Content-Type", "text/plain; charset=utf-8");
                    client.onreadystatechange = executePromise;
                    client.send();
                    function executePromise() {
                        if (client.readyState === XMLHttpRequest.DONE) {
                            resolve({status: client.status, body: client.responseText});
                        }
                    }
                });
            },
            postAsync: function (options) {
                return new Promise(function (resolve) {
                    var client = new XMLHttpRequest();
                    client.open("POST", options.url);
                    client.setRequestHeader("Content-Type", "text/plain; charset=utf-8");
                    client.onreadystatechange = executePromise;
                    client.send(options.body);
                    function executePromise() {
                        if (client.readyState === XMLHttpRequest.DONE) {
                            resolve({status: client.status, body: client.responseText});
                        }
                    }
                });
            }
        }
    }
});
