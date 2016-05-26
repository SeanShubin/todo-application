define(() => {
    'use strict';
    var constructor = () => {
        //private
        var stringToInt = originalString => {
            var parsed = parseInt(originalString);
            var backToString = parsed.toString();
            if (originalString === backToString) {
                return parsed;
            } else {
                throw "Unable to convert '" + originalString + "' to an integer"
            }
        };
        var stringToBoolean = originalString => {
            if (originalString === 'true') {
                return true;
            } else if (originalString === 'false') {
                return false;
            } else {
                throw "Unable to convert '" + originalString + "' to a boolean"
            }
        };
        var stringToLines = originalString => {
            var splitLines = originalString.split(/\r\n|\r|\n/);
            if (splitLines.length === 1 && splitLines[0] === '') {
                return [];
            } else {
                return splitLines;
            }
        };
        var linesToString = lines => {
            return lines.join('\r\n');
        };
        //public
        var contract = {
            stringToInt: stringToInt,
            stringToBoolean: stringToBoolean,
            stringToLines: stringToLines,
            linesToString: linesToString
        };
        return contract;
    };
    return constructor;
});
