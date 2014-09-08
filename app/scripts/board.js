'use strict';

// The board module exposes:
//    BoardData class
//    BoardView class
//    BoardController class

/*global define*/
define(['zepto', 'utils', 'events'], function($, utils, events){
    var Controller = utils.controller;
    var flattenArray = utils.flattenArray;
    var eventDispatcher = events.dispatcher;

    // Square class abstracts squares
    // on the board grid
    function Square(val) {
        var value;
        var moveable;

        if (val) {
            value = val;
        }

        // define properties of Square
        Object.defineProperties(this, {
            'value': {
                get: function() {
                    return value;
                },
                set: function(arg) {
                    value = arg;
                    return value;
                }
            },
            'moveable': {
                get: function() {
                    return moveable;
                }
            }
        });
    }

    // Base class for Board that
    // BoardData and BoardView will
    // inherit from
    function BoardBase(input) {
        // data will be an array of Squares
        var data = [];

        // define the data property of abstract class
        Object.defineProperties(this, {
            'data': {
                get: function() {
                    return data;
                }
            }
        });

        if (input) {
            this.initInput(input);
        } else {
            this.initEmpty();
        }
    }

    BoardBase.prototype.initInput = function(input) {
        $.each(input, function(subrow) {
            $.each(subrow, function(subsquare) {
                $.each(subsquare, function(row) {
                    $.each(row, function(val, l) {
                        var ret;
                        if (val) {
                            ret = new Square(val);
                        } else {
                            ret = new Square();
                        }
                        row[l] = ret;
                    });
                });
            });
        });
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
        var subrowIndex = i / 3;
        var rowIndex = i % 3;
        var data = this.data;
        var subrow = data[subrowIndex];
        $.each(subrow, function(subsquare) {
            res.concat(subsquare[rowIndex]);
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
        var subcolIndex = j / 3;
        var colIndex = j % 3;
        var data = this.data;
        var subcol = _subCol(data, subcolIndex);
        $.each(subcol, function(subsquare) {
            res.concat(subsquare[colIndex]);
        });
    };

    BoardBase.prototype.subsquare = function(i, j) {
        var data = this.data;
        return data[i][j];
    };

    BoardBase.prototype.square = function(i, j) {
        var subrowIndex = i / 3;
        var subcolIndex = j / 3;
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
    function BoardView(input) {
        // call base class to inherit properties
        // defined there, namely:
        //  this.data
        BoardBase.call(this, input);
        var activeNode = null;
        var allSquares = flattenArray(this.data);
        Object.defineProperties(this, {
            'activeNode': {
                get: function() {
                    return activeNode;
                },
                set: function(node) {
                    activeNode = node;
                },
                'allSquares': {
                    get: function() {
                        return allSquares;
                    }
                }
            }
        });
    }

    // now we actually inherit the methods from the base class
    BoardView.prototype = Object.create(BoardBase.prototype);

    function BoardController(view, model) {
        Controller.apply(this, view, model);
        this.init();
    }

    BoardController.prototype = Object.create(Controller.prototype);

    BoardController.prototype.init = function() {
        var squares = flattenArray(this.view.data);
        //$(squares).on
        eventDispatcher.addListner('numpad', function(val) {

        });
    };

    return {
        data: BoardData,
        controller: BoardController,
        view: BoardView
    };
});