define(() => {
    'use strict';
    var requestRegex = /(\w+) (\/[\w\-]+) HTTP\/1.1/;
    var responseRegex = /HTTP\/1.1 (\d+) \w+/;
    var constructor = collaborators => {
        //collaborators
        var http = collaborators.http;
        var marshalling = collaborators.marshalling;
        var fakeHttp = collaborators.fakeHttp;
        //private
        var extractBody = lines => {
            var isBlank = line => line === '';
            var blankLineIndex = lines.findIndex(isBlank);
            if (blankLineIndex === -1) {
                return '';
            } else {
                var bodyStartIndex = blankLineIndex + 1;
                var bodyLines = lines.slice(bodyStartIndex);
                var body = marshalling.linesToString(bodyLines);
                return body;
            }
        };
        var parseRequest = specRequest => {
            var lines = marshalling.stringToLines(specRequest.body.trim());
            var parsedLineOne = requestRegex.exec(lines[0]);
            var method = parsedLineOne[1];
            var uri = parsedLineOne[2];
            var body = extractBody(lines);
            return {
                method: method,
                uri: uri,
                body: body
            };
        };
        var parseResponse = specResponse => {
            var lines = marshalling.stringToLines(specResponse.body.trim());
            var parsedLineOne = responseRegex.exec(lines[0]);
            var statusString = parsedLineOne[1];
            var status = marshalling.stringToInt(statusString);
            var body = extractBody(lines);
            var response = {
                body: body, status: status
            };
            return response;
        };
        var load = options => {
            var name = options.name;
            var parseFunction = options.parseFunction;
            var specRequest = {
                url: name,
                method: 'GET'
            };
            return http.sendAsync(specRequest).then(parseFunction);

        };
        var loadResponse = name => {
            return load({name: name, parseFunction: parseResponse})
        };
        var loadRequest = name => {
            return load({name: name, parseFunction: parseRequest});
        };
        var loadedRequestResponse = requestResponseArray => {
            var result = {
                request: requestResponseArray[0],
                response: requestResponseArray[1]
            };
            return result;
        };
        var prependDatabase = requestResponse => {
            var request = {
                method: requestResponse.request.method,
                url: '/database' + requestResponse.request.uri,
                body: requestResponse.request.body
            };
            var response = requestResponse.response;
            return {
                request: request,
                response: response
            }
        };
        var appendToFakeHttp = requestResponse => {
            fakeHttp.addRequestResponsePair(requestResponse);
        };
        var loadRequestResponse = specPaths => {
            return Promise.all([loadRequest(specPaths.request), loadResponse(specPaths.response)]).then(loadedRequestResponse).then(prependDatabase).then(appendToFakeHttp);
        };
        //public
        var contract = {
            loadRequestResponse: loadRequestResponse,
            fakeHttp: fakeHttp
        };
        return contract;
    };
    return constructor;
});
