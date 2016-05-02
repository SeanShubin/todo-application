define(function () {
    var constructor = function (requestResponsePairs) {
        var requestsEqual = function (left, right) {
            if (left.url !== right.url) return false;
            if (left.method !== right.method) return false;
            if (left.body !== right.body) return false;
            return true;
        };
        var requestToResponseIndex = function (request) {
            for (var i = 0; i < requestResponsePairs.length; i++) {
                if (requestsEqual(requestResponsePairs[i].request, request)) {
                    return i;
                }
            }
            return -1;
        };
        var addRequestResponsePair = function (requestResponsePair) {
            requestResponsePairs.push(requestResponsePair);
        };
        var unconsumedRequestResponsePairs = function () {
            return requestResponsePairs;
        };
        var syndAsync = function (request) {
            var responseIndex = requestToResponseIndex(request);
            if (responseIndex === -1) {
                return Promise.reject('unexpected request: ' + JSON.stringify(request));
            } else {
                var response = requestResponsePairs.splice(responseIndex, 1)[0].response;
                return Promise.resolve(response);
            }
        };
        var contract = {
            addRequestResponsePair: addRequestResponsePair,
            unconsumedRequestResponsePairs: unconsumedRequestResponsePairs,
            sendAsync: syndAsync
        };
        return contract;
    };
    return constructor;
});
