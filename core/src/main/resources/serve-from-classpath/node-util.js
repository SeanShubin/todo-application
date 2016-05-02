define(function () {
    var constructor = function () {
        var classNameToSingleElement = function (options) {
            var elements = options.node.getElementsByClassName(options.className);
            if (elements.length === 1) {
                return elements[0];
            } else {
                throw 'expected exactly 1 element matching \'' + options.className + '\', got ' + elements.length
            }
        };
        var selectExactlyOne = function (options) {
            var elements = options.node.querySelectorAll(options.query);
            if (elements.length === 1) {
                return elements[0];
            } else {
                throw 'expected exactly 1 element matching \'' + options.query + '\', got ' + elements.length
            }
        };
        var contract = {
            classNameToSingleElement: classNameToSingleElement,
            selectExactlyOne: selectExactlyOne
        };
        return contract;
    };
    return constructor;
});
