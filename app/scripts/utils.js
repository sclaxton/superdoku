'use strict';

/*global define*/
define([], function() {

    function flattenArray(arr, deep) {
        var ret = [];
        arr.forEach(function(element) {
            if (Array.isArray(element)) {
                var concatable = deep ? flattenArray(element, true) : deepcopyArray(element);
                ret = ret.concat(concatable);
            } else {
                ret.push(element);
            }
        });
        return ret;
    }

    function deepcopyArray(arr) {
        var ret = [];
        arr.forEach(function(element) {
            if (Array.isArray(element)) {
                ret.push(deepcopyArray(element));
            } else {
                ret.push(element);
            }
        });
        return ret;
    }

    /* jshint ignore:start */
    // Array#find method polyfill
    if (!Array.prototype.find) {
        Array.prototype.find = function(predicate) {
            if (this === null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        };
    }
    /* jshint ignore:end */
    
    function allChildren(selector) {
        return selector + ' *';
    }

    function MVController(view, model) {
        Object.defineProperties(this, {
            'view': {
                get: function() {
                    return view;
                }
            },
            'model': {
                get: function() {
                    return model;
                }
            }
        });
        this.init();
    }

    MVController.prototype.init = function() {};

    return {
        mvcontroller: MVController,
        flattenArray: flattenArray,
        allChildren: allChildren,
        deepcopyArray: deepcopyArray
    };

});