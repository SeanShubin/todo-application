define(['qunit', 'http'],
    (qunit, createHttp) => {
        'use strict';

        qunit.module('specification');

        qunit.test("render empty", assert => {
            var http = createHttp();
            var request = {
                url: 'todo/specification/task/get-task-response.txt',
                method: 'GET'
            };
            assert.expect(2);
            var done = assert.async();
            var verify = response => {
                assert.equal(response.body,
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: text/plain; charset=utf-8\n' +
                        '\n' +
                '1 false Task A\n' +
                '2 true Task B\n' +
                '3 false Task C\n', 'body');
                assert.equal(response.status, 200, 'status code');
                done();
            };
            http.sendAsync(request).then(verify);
        });
    }
);
