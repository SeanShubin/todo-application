define(function () {
    var constructor = function () {
        return {
            classNameToSingleElement: function (options) {
                var elements = options.node.getElementsByClassName(options.className);
                if (elements.length === 1) {
                    return elements[0];
                } else {
                    throw 'expected exactly 1 element matching \'' + options.className + '\', got ' + elements.length
                }
            },
            selectExactlyOne: function (options) {
                var elements = options.node.querySelectorAll(options.query);
                if (elements.length === 1) {
                    return elements[0];
                } else {
                    throw 'expected exactly 1 element matching \'' + options.query + '\', got ' + elements.length
                }
            }
        };
    };
    return constructor;
});
