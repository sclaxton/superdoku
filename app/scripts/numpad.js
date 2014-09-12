'use strict';

/*global define*/
define(['zepto', 'events', 'utils', 'viewstate'], function(zepto, events, utils, viewstate) {

    var Controller = utils.mvcontroller;
    var flattenArray = utils.flattenArray;
    var deepcopyArray = utils.deepcopyArray;
    var eventDispatcher = events.dispatcher;

    function NumpadView(input) {
        var buttons = deepcopyArray(input) || [];
        var flatButtons = flattenArray(deepcopyArray(buttons));
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
    }

    // inhereit prototype from base controller class
    NumpadController.prototype = Object.create(Controller.prototype);

    NumpadController.prototype.init = function() {
        var view = this.view;
        var buttons = view.allButtons;
        var getClosestButton = viewstate.numpad.button.getClosest;
        $(buttons).on('click', function(e) {
            var button = getClosestButton(e.target);
            var val = Number(button.name);
            eventDispatcher.emit('numpad', val);
        });
        this.initViewState();
    };

    NumpadController.prototype.initViewState = function() {
        var view = this.view;
        var buttonOnSelect = viewstate.numpad.button.onSelect;
        var buttonOnSelectHandler = viewstate.numpad.button.onSelectHandler;
        var buttonOnHover = viewstate.numpad.button.onHover;
        var buttonOffHover = viewstate.numpad.button.offHover;
        var buttonUnselectAll = viewstate.numpad.button.unselectAll;
        var buttonUnfocusAll = viewstate.numpad.button.unfocusAll;
        var buttons = view.allButtons;
        var focusOutSelection = viewstate.focusOutSelectionPromise.value();

        eventDispatcher.addListener('selectSquare', function(val) {
            if (val) {
                var buttonIndex = val - 1;
                var button = buttons[buttonIndex];
                buttonOnSelect(button);
            } else {
                buttonUnselectAll();
            }
        });

        $(focusOutSelection).on({
            click: buttonUnfocusAll,
            doubleTap: buttonUnfocusAll
        });

        $(view.allButtons).on({
            click: buttonOnSelectHandler,
            mouseenter: buttonOnHover,
            mouseleave: buttonOffHover
        });
    };

    return {
        controller: NumpadController,
        view: NumpadView
    };

});