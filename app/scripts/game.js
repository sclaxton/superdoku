'use strict';

// The game module exposes the Game class

/*global define*/
define(['board', 'numpad', 'events', 'viewstate', 'utils'],
    function(board, numpad, events, viewstate, utils) {

    var Controller = utils.controller;
    var eventDispatcher = events.dispatcher;

    function Game(boardControllerInput) {
        // moves is a stack of triples row, col, valid 
        // row, col are integers and valid is a bool
        //  e.g. { row: i, col: j, valid: bool}
        var moves = [];
        var boardController = boardControllerInput;
        var controller = new GameController();

        Object.defineProperties(this, {
            'moves': {
                get: function() {
                    return moves;
                }
            },
            'boardController': {
                get: function() {
                    return boardController;
                }
            },
            'boardIsVaild': {
                get: function() {
                    return moves[0] ? moves[0].valid : true;
                }
            },
            'controller': {
                get: function() {
                    return controller;
                }
            },
            'boardIsWin': {
                get: function(){
                    var model = this.boardController.model;
                    var data = model.flatData;
                    return data.every(function(square) {
                        return square.value;
                    }) && this.boardIsVaild;
                }
            }
        });
    }

    function containsUnique(arr) {
        var map = [];
        arr.every(function(num) {
            if (map[num]) {
                return false;
            } else {
                map[num] = true;
                return true;
            }
        });
    }

    Game.prototype.moveVaild = function(row, col) {
        var model = this.boardController.model;
        var subrow = row / 3;
        var subcol = col / 3;
        var subsquare = flattenArray(model.subsquare(subrow, subcol));
        return containsUnique(model.row(row)) &&
            containsUnique(model.col(col)) &&
            containsUnique(subsquare);
    };

    Game.prototype.pushMove = function(row, col, valid) {
        var pair = {
            row: row,
            col: col,
            valid: valid
        };
        this.moves.push(pair);
    };

    Game.prototype.popMove = function() {
        return this.moves.pop();
    };

    Game.prototype.handleMove = function(row, col) {
        
        this.pushMove(row, col, this.moveVaild(row, col));

        if (this.isBoardWin) {
            this.handleWin();
        }
    };

    // pop the last move off the stack
    // then fire back event so board
    // controller can restore model and view
    Game.prototype.undo = function() {
        var move = this.popMove();
        if (move) {
            eventDispatcher.emit('undo', move.row, move.col);
        }
    };

    Game.prototype.handleWin = function() {
        window.alert('You win!');
        eventDispatcher.emit('win');
    };

    function GameController() {
        Controller.call(this);
        this.init();
    }

    GameController.prototype = Object.create(Controller.prototype);

    GameController.prototype.init = function() {
        var $undoButton = $(viewstate.menu.undoButtonSelector);
        $undoButton.on({
            click: this.undo
        });
    };

    GameController.initViewState = function() {
        var $undoButton = $(viewstate.menu.undoButtonSelector);
        var onPress = viewstate.menu.onPress;
        var offPress = viewstate.menu.offPress;
        $undoButton.on({
            mousedown: onPress,
            mouseup: offPress
        });
    };

    return {
        contructor: Game,
        controller: GameController
    };
});