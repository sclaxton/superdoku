'use strict';

// the viewstate module exposes all info needed
// by the controller to mutate the state of the view

/*global define*/
define(['onload', 'utils'], function(load, utils) {

    var flattenArray = utils.flattenArray;

    var buttonsPromise = load.numButtonsPromise.then(function(val) {
        return flattenArray(val, true);
    });
    var squaresPromise = load.boardNodesPromise.then(function(val) {
        return flattenArray(val, true);
    });
    var focusOutSelectionPromise = load.focusOutSelectionPromise;
    var validNotification = load.validNotificationPromise;
    var invalidNotification = load.invalidNotificationPromise;

    // game state selectors
    var visibulityHiddenClass = 'hidden';
    var notificationHideSelector = 'fade-hidden';

    // board state selectors
    var squareClass = 'square';
    var selectedSquareClass = 'expand-select';
    var hoverSquareClass = 'expand-hover';
    var inactiveSquareSelector = 'inactive';

    // numpad state selectors
    var selectedButtonClass = 'button-select';
    var hoverButtonClass = 'button-hover';

    // general actions

    function getClosest(startnode, selector) {
        if (startnode.classList.contains(squareClass) ||
            startnode.tagName.toUpperCase() === selector.toUpperCase() ||
            startnode.id === selector) {
            return startnode;
        } else {
            return $(startnode).parents(selector).get(0);
        }
    }

    function isActive(node) {
        return !node.classList.contains('inactive');
    }

    function unselectAll() {
        unselectAllSquares();
        unselectAllButtons();
    }

    function toastNotification(node, duration) {
        node.classList.remove(notificationHideSelector, visibulityHiddenClass);
        setTimeout(function() {
            node.classList.add(notificationHideSelector);
        }, duration);
    }

    function pushNotification(type) {
        switch (type) {
            case 'boardInvalid':
                toastNotification(invalidNotification.value(), 2000);
                break;
            case 'boardValid':
                toastNotification(validNotification.value(), 2000);
                break;
            case 'undoInvalid':

                break;
            case 'resetWarning':

                break;
        }
    }

    // board actions

    function getClosestSquare(startnode) {
        return getClosest(startnode, '.' + squareClass);
    }

    function unselectAllSquares() {
        // remove selection from other buttons
        var squares = squaresPromise.value();
        $(squares).removeClass(selectedSquareClass);
    }

    function squareOnSelect(square) {
        if (isActive(square)) {
            unselectAllSquares();
            square.classList.add(selectedSquareClass);
        }
    }

    // numpad actions

    function getClosestButton(startnode) {
        return getClosest(startnode, 'button');
    }

    function unselectAllButtons() {
        // remove selection from other buttons
        var buttons = buttonsPromise.value();
        $(buttons).removeClass(selectedButtonClass);
    }

    function buttonOnSelect(node) {
        // remove selection from other buttons
        var buttons = buttonsPromise.value();
        $(buttons).removeClass(selectedButtonClass);
        node.classList.add(selectedButtonClass);
    }

    return {
        unselectAll: unselectAll,
        focusOutSelectionPromise: focusOutSelectionPromise,
        pushNotification: pushNotification,
        board: {
            squaresPromise: squaresPromise,
            square: {
                getClosest: getClosestSquare,
                insertText: function(node, string) {
                    $(node).find('span').text(string);
                },
                inactivate: function(node) {
                    node.classList.add(inactiveSquareSelector);
                },
                unselectAll: unselectAllSquares,
                unfocusAll: function(e) {
                    var focusOutSelection = focusOutSelectionPromise.value();
                    if (focusOutSelection.indexOf(e.target) > -1) {
                        unselectAllSquares();
                    }
                },
                onHover: function(e) {
                    var square = getClosest(e.target, '.' + squareClass);
                    if (isActive(square)) {
                        square.classList.add(hoverSquareClass);
                    }
                },
                offHover: function(e) {
                    var square = getClosest(e.target, '.' + squareClass);
                    square.classList.remove(hoverSquareClass);
                },
                onSelect: squareOnSelect,
                onSelectHandler: function(e) {
                    var square = getClosest(e.target, '.' + squareClass);
                    squareOnSelect(square);
                }
            }
        },
        numpad: {
            buttonsPromise: buttonsPromise,
            button: {
                getClosest: getClosestButton,
                unselectAll: unselectAllButtons,
                unfocusAll: function(e) {
                    var focusOutSelection = focusOutSelectionPromise.value();
                    if (focusOutSelection.indexOf(e.target) > -1) {
                        unselectAllButtons();
                    }
                },
                onHover: function(e) {
                    var button = getClosest(e.target, 'button');
                    button.classList.add(hoverButtonClass);
                },
                offHover: function(e) {
                    var button = getClosest(e.target, 'button');
                    button.classList.remove(hoverButtonClass);
                },
                onSelect: buttonOnSelect,
                onSelectHandler: function(e) {
                    var button = getClosest(e.target, 'button');
                    buttonOnSelect(button);
                }
            }
        },
        menu: {
            onHover: function(e) {
                var button = getClosest(e.target, 'button');
                button.classList.add(hoverButtonClass);
            },
            offHover: function(e) {
                var button = getClosest(e.target, 'button');
                button.classList.remove(hoverButtonClass);
            },
            onPress: function(e) {
                var button = getClosest(e.target, 'button');
                button.classList.add(selectedButtonClass);
            },
            offPress: function(e) {
                var button = getClosest(e.target, 'button');
                button.classList.remove(selectedButtonClass);
            }
        }
    };
});