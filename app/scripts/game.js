'use strict';

// The game module exposes the Game class

/*global define*/ 
define(['board', 'numpad'], function(board, numpad) {

    var BoardController = board.controller;

    function Game() {
        // moves is a stack of row/col 
        // pairs, e.g. { row: i, col: j }
        var moves = [];
        var boardController = new BoardController();

        Object.defineProperties(this, {
            'moves': {
                get: function() {
                    return moves;
                }
            },
            'BoardController': {
                get: function() {
                    return BoardController;
                }
            }
        });
    }

    Game.prototype.pushMove = function(row, col) {
        var pair = {
            row: row,
            col: col
        };
        this.moves.push(pair);
    };

    Game.prototype.popMove = function() {
        return this.moves.pop();
    };

    // pop the last move off the stack
    Game.prototype.back = function() {
        // interface with 
    };

    Game.prototype.handleWin = function() {

    };

});