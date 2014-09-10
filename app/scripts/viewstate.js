'use strict';

// the viewstate module exposes all info needed
// by the controller to mutate the state of the view

/*global define*/
define(['onload', 'utils'], function(load, utils) {

    var flattenArray = utils.flattenArray;

    var buttonsPromise = load.numButtonsPromise.then(function(val) {
        return flattenArray(val);
    });
    var squaresPromise = load.boardNodesPromise.then(function(val) {
        return flattenArray(val);
    });
    var focusOutSelectionPromise = load.focusOutSelectionPromise;
    var bodySelectionPromise = load.bodySelectionPromise;

    // board state selectors
    var squareClass = 'square';
    var selectedSquareClass = 'expand-select';
    var hoverSquareClass = 'expand-hover';
    var inactiveSquareSelector = 'inactive';

    // numpad state selectors
    var selectedButtonClass = 'button-select';
    var hoverButtonClass = 'button-hover';

    // menu state selectos
    var undoButtonSelector = '#undo';

    function destroyHandlers() {
        focusOutSelectionPromise.then(function($selection) {
            $selection.off();
        });
        squaresPromise.then(function(squares) {
            $(squares).off();
        });
        buttonsPromise.then(function(buttons) {
            $(buttons).off();
        });
    }

    return {
        focusOutSelectionPromise: focusOutSelectionPromise,
        bodySelectionPromise: bodySelectionPromise,
        board: {
            squaresPromise: squaresPromise,
            square: {
                getClosest: function(node){
                  if(node.classList.contains(squareClass)){
                    return node;
                  } else {
                    return $(node).parents('.' + squareClass).get(0);
                  }
                },
                insertText: function(node, string) {
                  $(node).find('span').text(string);
                },
                inactivate: function(node) {
                    node.classList.add(inactiveSquareSelector);
                },
                unselectAll: function() {
                    var squares = squaresPromise.value();
                    $(squares).removeClass(selectedSquareClass);
                },
                onHover: function(e) {
                    e.target.classList.add(hoverSquareClass);
                },
                offHover: function(e) {
                    e.target.classList.remove(hoverSquareClass);
                },
                onSelect: function(e) {
                    // remove selection from other squares
                    var squares = squaresPromise.value();
                    $(squares).removeClass(selectedSquareClass);
                    e.target.classList.add(selectedSquareClass);
                }
            }
        },
        numpad: {
            buttonsPromise: buttonsPromise,
            button: {
                unselectAll: function() {
                    // remove selection from other buttons
                    var buttons = buttonsPromise.value();
                    $(buttons).removeClass(selectedButtonClass);
                },
                onHover: function(e) {
                    e.target.classList.add(hoverButtonClass);
                },
                offHover: function(e) {
                    e.target.classList.remove(hoverButtonClass);
                },
                onSelect: function(node) {
                    // remove selection from other buttons
                    var buttons = buttonsPromise.value();
                    //$(buttons).removeClass(selectedButtonClass);
                    node.classList.add(selectedButtonClass);
                }
            }
        },
        menu: {
            destroyHandlers: destroyHandlers,
            undoButtonSelector: undoButtonSelector,
            onHover: function(e) {
                e.target.classList.add(hoverButtonClass);
            },
            offHover: function(e) {
                e.target.classList.remove(hoverButtonClass);
            },
            onPress: function(e) {
                e.target.classList.add(selectedButtonClass);
            },
            offPress: function(e) {
                e.target.classList.remove(selectedButtonClass);
            }
        }
    };
});