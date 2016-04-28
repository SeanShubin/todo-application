define(function () {
    return {
        classNameToSingleElement: function (options) {
            var elements = options.node.getElementsByClassName(options.className);
            if (elements.length === 1) {
                return elements[0];
            } else {
                throw 'expected exactly 1 element matching \'' + options.className + '\', got ' + elements.length
            }
        }
    };
});
