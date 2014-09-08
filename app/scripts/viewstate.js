'use strict';

// the viewstate module exposes all info needed
// by the controller to mutate the state of the view

/*global define*/
define(['onload', 'utils'], function(load, utils) {

    var flattenArray = utils.flattenArray;

    var buttonsPromise = load.numButtons.then(function(val) {
        return flattenArray(val);
    });
    var squaresPromise = load.boardNodes.then(function(val) {
        return flattenArray(val);
    });
    var allChildren = utils.allChildren;

    // general state selectors
    var masterContainer = '#master-container';
    var controlContainer = '#control-container';

    // board state selectors
    var selectedSquareClass = '.expand-select';
    var hoverSquareClass = '.expand-hover';
    var boardOutermostContainer = '#board-square';
    var inactiveSquareSelector = '.inactive';

    // numpad state selectors
    var selectedButtonClass = '.button-select';
    var hoverButtonClass = '.button-hover';

    var focusOutSelection = function() {
        var master = allChildren(masterContainer);
        var board = allChildren(boardOutermostContainer);
        var control = allChildren(controlContainer);
        return $(master).not(board + ',' + control);
    };

    return {
        focusOutSelection: focusOutSelection,
        board: {
            squaresPromise: squaresPromise,
            squares: {
                inactivate: function(node) {
                    node.classList.add(inactiveSquareSelector);
                },
                unselectAll: function() {
                    var squares = squaresPromise.value();
                    $(squares).removeClass(selectedSquareClass);
                },
                onHover: function(node) {
                    node.classList.add(hoverSquareClass);
                },
                offHover: function(node) {
                    node.classList.remove(hoverSquareClass);
                },
                onSelect: function(node) {
                    // remove selection from other squares
                    var squares = squaresPromise.value();
                    $(squares).removeClass(selectedSquareClass);
                    node.classList.add(selectedSquareClass);
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
                onHover: function(node) {
                    node.classList.add(hoverButtonClass);
                },
                offHover: function(node) {
                    node.classList.remove(hoverButtonClass);
                },
                onSelect: function(node) {
                    // remove selection from other buttons
                    var buttons = buttonsPromise.value();
                    $(buttons).removeClass(selectedButtonClass);
                    node.classList.add(selectedButtonClass);
                }
            }
        },
        menu: {
            onHover: function(node) {
                node.classList.add(hoverButtonClass);
            },
            offHover: function(node) {
                node.classList.remove(hoverButtonClass);
            },
            onPress: function(node) {
                node.classList.add(selectedButtonClass);
            },
            offPress: function(node) {
                node.classList.remove(selectedButtonClass);
            }
        }
    };
});