'use strict';

// The board module exposes:
//    BoardData class
//    BoardView class
//    BoardController class

/*global define*/
define(['zepto', 'utils', 'events', 'viewstate'], function($, utils, events, viewstate) {
    var Controller = utils.controller;
    var flattenArray = utils.flattenArray;
    var deepcopyArray = utils.deepcopyArray;
    var eventDispatcher = events.dispatcher;

    // Square class abstracts squares
    // on the board grid
    function Square(val, moveable) {
        var value = val;
        var immutable = moveable || false;

        // define properties of Square
        Object.defineProperties(this, {
            'value': {
                get: function() {
                    return value;
                },
                set: function(arg) {
                    value = arg;
                }
            },
            'immutable': {
                get: function() {
                    return immutable;
                }
            }
        });
    }

    // Base class for Board that
    // BoardData and BoardView will
    // inherit from
    function BoardBase(input) {
        // data will be an array of Squares
        var data = input ? this.initInput(input) : this.initEmpty();

        // define the data property of abstract class
        Object.defineProperties(this, {
            'data': {
                get: function() {
                    return data;
                }
            },
            'flatData': {
                get: function() {
                    return flattenArray(data);
                }
            }
        });
    }

    BoardBase.prototype.initInput = function(input) {
        copy = deepcopyArray(input);
        copy.forEach(function(subrow, i) {
            subrow.forEach(function(subsquare, j) {
                subsquare.forEach(function(row, k) {
                    row.forEach(function(val, l, row) {
                        var ret;
                        if (val) {
                            ret = new Square(val, true);
                        } else {
                            ret = new Square();
                        }
                        row[l] = ret;
                    });
                });
            });
        });
        return copy;
    };

    BoardBase.prototype.initEmpty = function() {
        var data = this.data;
        for (var i = 0; i < 3; i++) {
            var subrow = data[i] = [];
            for (var j = 0; j < 3; i++) {
                var subsquare = subrow[j] = [];
                for (var k = 0; k < 3; k++) {
                    var row = subsquare[k] = [];
                    for (var l = 0; l < 3; l++) {
                        row[l] = new Square();
                    }
                }
            }
        }
    };

    BoardBase.prototype.row = function(i) {
        var res = [];
        var subrowIndex = Math.floor(i / 3);
        var rowIndex = i % 3;
        var data = this.data;
        var subrow = data[subrowIndex];
        $.each(subrow, function(subsquare) {
            res = res.concat(subsquare[rowIndex]);
        });
        return res;
    };

    function _subCol(data, j) {
        var res = [];
        for (var i = 0; i < 3; i++) {
            res.shift(data[i][j]);
        }
        return res;
    }

    BoardBase.prototype.col = function(j) {
        var res = [];
        var subcolIndex = Math.floor(j / 3);
        var colIndex = j % 3;
        var data = this.data;
        var subcol = _subCol(data, subcolIndex);
        $.each(subcol, function(subsquare) {
            res = res.concat(subsquare[colIndex]);
        });
    };

    BoardBase.prototype.subsquare = function(i, j) {
        var data = this.data;
        return data[i][j];
    };

    BoardBase.prototype.square = function(i, j) {
        var subrowIndex = Math.floor(i / 3);
        var subcolIndex = Math.floor(j / 3);
        var rowIndex = i % 3;
        var colIndex = j % 3;
        var subsquare = this.subsquare(subrowIndex, subcolIndex);
        return subsquare[rowIndex][colIndex];
    };

    BoardBase.prototype.squareVal = function(i, j, val) {
        var square = this.square(i, j);
        if (val) {
            square.value = val;
            return val;
        } else {
            return square.value;
        }
    };

    BoardBase.prototype.isSquareImmutable = function(i, j) {
        var square = this.square(i, j);
        return square.immutable;
    };



    // BoardData class inherits from BoardBase class
    // it contains the numerical data for the sudoku board
    // 
    // input: a nested array of numbers representing a sudoku board
    //        i.e. there are 3 rows of 3X3 subsquares each having
    //        subsquares
    function BoardData(input) {
        // call base class to inherit properties
        // defined there
        BoardBase.call(this, input);
    }

    // now we actually inherit the methods from the base class
    BoardData.prototype = Object.create(BoardBase.prototype);


    // BoardView also inherits from BoardBase
    //
    // input: a nested array as above, but with elements
    //        corresponding to dom nodes of divs that visually
    //        represent the squares of the board
    function BoardView(input, model) {
        // call base class to inherit properties
        // defined there, namely:
        //  this.data
        BoardBase.call(this, input);
        var activeSquare = null;
        var allNodes = flattenArray(input);
        Object.defineProperties(this, {
            'activeSquare': {
                get: function() {
                    return activeSquare;
                },
                set: function(node) {
                    activeSquare = node;
                },
            },
            'allNodes': {
                get: function() {
                    return allNodes;
                }
            }
        });

        this.init(model);
    }

    // now we actually inherit the methods from the base class
    BoardView.prototype = Object.create(BoardBase.prototype);

    BoardView.prototype.indexOf = function(node) {
        var absoluteIndex = this.allNodes.indexOf(node);
        var absoluteSubsquare = Math.floor(absoluteIndex / 9);
        var subrow = Math.floor(absoluteSubsquare / 3);
        var subcol = absoluteSubsquare % 3;
        var row = Math.floor(absoluteIndex / 3) % 3;
        var col = absoluteIndex % 3;
        return {
            row: 3*subrow + row,
            col: 3*subcol + col
        };
    };

    BoardView.prototype.init = function(model) {
        var modelData = flattenArray(model.data);
        var viewData = flattenArray(this.data);
        var inactivateSquare = viewstate.board.square.inactivate;
        var insertText = viewstate.board.square.insertText;
        modelData.forEach(function(square, i) {
            if (square.value && square.immutable) {
                var domNode = viewData[i].value;
                insertText(domNode, square.value.toString());
                inactivateSquare(domNode);
            } else {
                viewData[i].immutable = false;
            }
        });
    };

    function BoardController(view, model) {
        Controller.call(this, view, model);
        this.init();
    }

    BoardController.prototype = Object.create(Controller.prototype);

    BoardController.prototype.init = function() {
        var view = this.view;
        var model = this.model;
        var squares = view.allNodes;
        var getClosestSquare = viewstate.board.square.getClosest;
        $(squares).on({
            click: function(e) {
                var square = getClosestSquare(e.target);
                var indexPair = view.indexOf(square);
                var targetVal = model.squareVal(indexPair.row, indexPair.col);
                view.activeSquare = indexPair;
                eventDispatcher.emit('selectSquare', targetVal);
            }
        });

        eventDispatcher.addListener('numpad', function(val) {
            var activeSquare = view.activeSquare;
            var row = activeSquare.row;
            var col = activeSquare.col;
            if (activeSquare && !model.isSquareImmutable(row, col)) {
                model.squareVal(row, col, val);
                eventDispatcher.emit('modelUpdate', activeSquare, val);
                eventDispatcher.emit('boardChange', activeSquare);
            }
        });

        eventDispatcher.addListener('modelUpdate', function(indexPair, val) {
            var node = view.squareVal(indexPair.row, indexPair.col);
            node.textContent = val.toString();
            eventDispatcher.emit('boardChange', indexPair);
        });

        eventDispatcher.addListener('back', function(row, col) {
            model.squareVal(row, col, undefined);
            var node = view.squareVal(row, col);
            node.textContent = '';
        });

        this.initViewState();
    };

    BoardController.prototype.initViewState = function() {
        var view = this.view;
        // viewstate info needed to alter view state
        var squareUnselectAll = viewstate.board.square.unselectAll;
        var squareOnSelect = viewstate.board.square.onSelect;
        var squareOnHover = viewstate.board.square.onHover;
        var squareOffHover = viewstate.board.square.offHover;
        var focusOutSelectionPromise = viewstate.focusOutSelectionPromise;
        var bodySelectionPromise = viewstate.bodySelectionPromise;

        function unfocusSquare() {
            squareUnselectAll();
            view.activeSquare = null;
        }

        bodySelectionPromise.then(function($body) {
            $body.on({
                doubleTap: unfocusSquare
            });
        });

        focusOutSelectionPromise.then(function(focusOutSelection) {
            $(focusOutSelection).on({
                click: unfocusSquare
            });
        });


        $(this.allNodes).on({
            click: squareOnSelect,
            mouseenter: squareOnHover,
            mouseleave: squareOffHover
        });
    };

    return {
        data: BoardData,
        controller: BoardController,
        view: BoardView
    };
});