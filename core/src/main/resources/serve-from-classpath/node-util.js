define(() => {
    'use strict';
    var constructor = () => {
        //private
        var classNameToSingleElement = options => {
            var node = options.node;
            var className = options.className;
            var elements = node.getElementsByClassName(className);
            if (elements.length === 1) {
                return elements[0];
            } else {
                throw 'expected exactly 1 element matching \'' + className + '\', got ' + elements.length
            }
        };
        var selectExactlyOne = options => {
            var dom = options.dom;
            var selector = options.selector;
            var nodes = dom.querySelectorAll(selector);
            if (nodes.length === 1) {
                return nodes[0];
            } else {
                throw 'Expected exactly one match for ' + selector + ' got ' + nodes.length;
            }
        };
        var howManyExist = options => {
            var dom = options.dom;
            var selector = options.selector;
            var nodes = dom.querySelectorAll(selector);
            return nodes.length;
        };
        var isChecked = options => {
            var dom = options.dom;
            var selector = options.selector;
            return dom.querySelectorAll(selector + ':checked').length === 1
        };
        var toggleCheckbox = checkbox => {
            checkbox.checked = !checkbox.checked;
            var event = document.createEvent("HTMLEvents");
            event.initEvent("change", false, true);
            return checkbox.dispatchEvent(event);
        };
        var sendKeyUp = options => {
            var element = options.element;
            var key = options.key;
            var event = document.createEvent("HTMLEvents");
            event.initEvent("keyup", false, true);
            event.which = key;
            return element.dispatchEvent(event);
        };
        //public
        var contract = {
            classNameToSingleElement: classNameToSingleElement,
            selectExactlyOne: selectExactlyOne,
            toggleCheckbox: toggleCheckbox,
            howManyExist: howManyExist,
            isChecked: isChecked,
            sendKeyUp: sendKeyUp
        };
        return contract;
    };
    return constructor;
});
