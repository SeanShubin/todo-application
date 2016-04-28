define(function () {
    return function () {
        var requestResponsePairs = [];
        var requestToResponseIndex = function () {
        };
        return {
            addRequestResponsePair: function (requestResponsePair) {
                requestResponsePairs.push(requestResponsePair);
            },
            unconsumedRequestResponsePairs: function () {
                return requestResponsePairs;
            },
            httpSendAsync: function (options) {
                var responseIndex = requestToResponseIndex(options);
                if (responseIndex === -1) {
                    return Promise.reject('request not registered');
                } else {
                    var response = responses.splice(responseIndex, 1);
                    return Promise.resolve(response)
                }
            }
        }
    }
});
