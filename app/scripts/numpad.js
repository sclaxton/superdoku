'use strict';

/*global define*/
define(['zepto', 'events', 'utils', 'viewstate'], function(zepto, events, utils, viewstate) {

    var Controller = utils.controller;
    var eventDispatcher = events.dispatcher;
    eventDispatcher.defineEvent('hi');

    console.log(eventDispatcher);

    function NumpadView(input) {
        var buttons = [];
        var flatButtons = flattenArray(input);
        if (input) {
            buttons = input;
        }
        Object.deineProperties(this, {
            'buttons': {
                get: function() {
                    return buttons;
                }
            },
            'allButtons': {
              get: function(){
                return flatButtons;
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
        var view = this.view;
        var buttons = view.buttons;
        $(buttons).on('click', function(e) {
            var val = Number(e.target.name);
            eventDispatcher.emit('numpad', val);
        });
    };

    NumpadController.prototype.initViewState = function(){
      var view = this.view;
      var buttonOnSelect = viewstate.numpad.button.onSelect;
      var buttonOnHover = viewstate.numpad.button.onHover;
      var buttonOffHover = viewstate.numpad.button.offHover;
      var buttonUnselectAll = viewstate.numpad.button.unselectAll;
      var buttons = view.allButtons;
      var focusOutSelection = viewstate.focusOutSelection();

      eventDispatcher.addListener('selectSquare', function(val){
        var buttonIndex = val-1;
        var button = buttons[buttonIndex];
        buttonOnSelect(button);
      });

      $('body').on({ 
        doubleTap: buttonUnselectAll
      });

      $(squaresComplement).on({
        click: buttonUnselectAll
      });

      $(this.allNodes).on({
          click: buttonOnSelect,
          mouseenter: buttonOnHover,
          mouseleave: buttonOffHover
      });

    }

});