define(function () {
    var constructor = function () {
        return {
            stringToInt: function (originalString) {
                var parsed = parseInt(originalString);
                var backToString = parsed.toString();
                if (originalString === backToString) {
                    return parsed;
                } else {
                    throw "Unable to convert '" + originalString + "' to an integer"
                }
            },
            stringToBoolean: function (originalString) {
                if (originalString === 'true') {
                    return true;
                } else if (originalString === 'false') {
                    return false;
                } else {
                    throw "Unable to convert '" + originalString + "' to a boolean"
                }
            },
            stringToLines: function (originalString) {
                var splitLines = originalString.split(/\r\n|\r|\n/);
                if (splitLines.length === 1 && splitLines[0] === '') {
                    return [];
                } else {
                    return splitLines;
                }
            }
        };
    };
    return constructor;
});
