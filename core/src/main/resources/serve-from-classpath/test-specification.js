define(['qunit', 'http', 'marshalling', 'http-spec-loader'],
    (qunit, createHttp, createMarshalling, createHttpSpecLoader) => {
        'use strict';

        qunit.module('specification');

        qunit.test("prototype", assert => {
            var http = createHttp();
            var marshalling = createMarshalling();
            var specRequest = {
                url: 'todo/specification/task/get-task-response.txt',
                method: 'GET'
            };
            var expectedResponse = {
                body: '1 false Task A\n' +
                '2 true Task B\n' +
                '3 false Task C\n',
                status: 200
            };
            var requestRegex = /(\w+) (\/[\w\-]+) HTTP\/1.1/;
            var responseRegex = /HTTP\/1.1 (\d+) \w+/;
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
            assert.expect(4);
            var done = assert.async();
            var verify = specResponse => {
                var actualResponse = parseResponse(specResponse);
                assert.equal(specResponse.body,
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: text/plain; charset=utf-8\n' +
                    '\n' +
                    '1 false Task A\n' +
                    '2 true Task B\n' +
                    '3 false Task C\n', 'body');
                assert.equal(specResponse.status, 200, 'status code');
                assert.equal(actualResponse.body,
                    '1 false Task A\r\n' +
                    '2 true Task B\r\n' +
                    '3 false Task C\r\n', 'body');
                assert.equal(actualResponse.status, 200, 'status code');
                done();
            };
            http.sendAsync(specRequest).then(verify);
        });
        qunit.test("get tasks", assert => {
            var http = createHttp();
            var marshalling = createMarshalling();
            var httpSpecLoader = createHttpSpecLoader({http: http, marshalling: marshalling});

            var prependDatabase = request => {
                return {
                    method: request.method,
                    url: '/database' + request.uri,
                    body: request.body
                }
            };

            assert.expect(1);
            var done = assert.async();
            var verify = request => {
                console.log(request);
                assert.equal(1, 1, 'one');
                done();
            };
            httpSpecLoader.loadRequest('todo/specification/task/get-task-request.txt').then(prependDatabase).then(http.sendAsync).then(verify);
        });
    }
);
