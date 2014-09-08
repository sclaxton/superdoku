'use strict';

/*global define*/
define([], function() {

    function flattenArray(arr) {
        var ret = [];
        arr.forEach(function(element) {
            if (Array.isArray(element)) {
                ret = ret.concat(flattenArray(element));
            } else {
                ret.push(element);
            }
        });
        return ret;
    }

    function Controller(view, model) {
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

    Controller.prototype.init = function() {};

    return {
        controller: Controller,
        flattenArray: flattenArray
    }

});