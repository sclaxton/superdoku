'use strict';

/*global define*/
define(['zepto', 'events', 'utils'], function(zepto, events, utils) {

    var Controller = utils.controller;
    var eventDispatcher = events.dispatcher;

    function NumpadView(input) {
        var buttons = [];
        if (input) {
            buttons = input;
        }
        Object.deineProperties(this, {
            'buttons': {
                get: function() {
                    return buttons;
                }
            }
        });
    }

    function NumpadController(view) {
        // inherit instance properties from base controller class
        Controller.apply(this, view);
    }

    // inhereit prototype from base controller class
    NumpadController.prototype = Object.create(Controller.prototype);

    NumpadController.prototype.init = function() {
        var buttons = this.view.buttons;
        $(buttons).on('click', function(e) {
            var val = Number(e.target.name);
            eventDispatcher.emit('numpad', val);
        });
    };

});