define(function () {
    var requestRegex = /(\w+) (\/[\w\-]+) HTTP\/1.1/;
    var responseRegex = /HTTP\/1.1 (\d+) \w+/;
    var constructor = function (collaborators) {
        var http = collaborators.http;
        var marshalling = collaborators.marshalling;
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
            var lines = marshalling.stringToLines(specRequest.body);
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
            var lines = marshalling.stringToLines(specResponse.body);
            var parsedLineOne = responseRegex.exec(lines[0]);
            var statusString = parsedLineOne[1];
            var status = marshalling.stringToInt(statusString);
            var body = extractBody(lines);
            return {
                body: body, status: status
            };
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
        var loadResponse = function (name) {
            return load({name: name, parseFunction: parseResponse})
        };
        var loadRequest = function (name) {
            return load({name: name, parseFunction: parseRequest});
        };
        var contract = {
            loadRequest: loadRequest,
            loadResponse: loadResponse
        };
        return contract;
    };
    return constructor;
});
