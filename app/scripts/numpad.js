'use strict';

/*global define*/
define(['zepto', 'events', 'utils', 'viewstate'], function(zepto, events, utils, viewstate) {

    var Controller = utils.controller;
    var flattenArray = utils.flattenArray;
    var eventDispatcher = events.dispatcher;

    function NumpadView(input) {
        var buttons = input || [];
        var flatButtons = flattenArray(buttons);
        Object.defineProperties(this, {
            'buttons': {
                get: function() {
                    return buttons;
                }
            },
            'allButtons': {
                get: function() {
                    return flatButtons;
                }
            }
        });
    }

    function NumpadController(view) {
        // inherit instance properties from base controller class
        Controller.call(this, view);
        this.init();
    }

    // inhereit prototype from base controller class
    NumpadController.prototype = Object.create(Controller.prototype);

    NumpadController.prototype.init = function() {
        var view = this.view;
        var buttons = view.buttons;
        $(buttons).on('click', function(e) {
            var val = Number(e.target.name);
            eventDispatcher.emit('numpad', val);
        });
        this.initViewState();
    };

    NumpadController.prototype.initViewState = function() {
        var view = this.view;
        var buttonOnSelect = viewstate.numpad.button.onSelect;
        var buttonOnHover = viewstate.numpad.button.onHover;
        var buttonOffHover = viewstate.numpad.button.offHover;
        var buttonUnselectAll = viewstate.numpad.button.unselectAll;
        var buttons = view.allButtons;
        var focusOutSelectionPromise = viewstate.focusOutSelectionPromise;
        var bodySelectionPromise = viewstate.bodySelectionPromise;

        eventDispatcher.addListener('selectSquare', function(val) {
            if (val) {
                var buttonIndex = val - 1;
                var button = buttons[buttonIndex];
                buttonOnSelect(button);
            }
        });

        bodySelectionPromise.then(function($body) {
            $body.on({
                doubleTap: buttonUnselectAll
            });
        });

        focusOutSelectionPromise.then(function(focusOutSelection) {
            $(focusOutSelection).on({
                click: buttonUnselectAll
            });
        });

        $(this.allNodes).on({
            click: buttonOnSelect,
            mouseenter: buttonOnHover,
            mouseleave: buttonOffHover
        });
    };

    return {
        controller: NumpadController,
        view: NumpadView
    };

});