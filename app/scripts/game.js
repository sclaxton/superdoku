'use strict';

// The game module exposes the Game class

/*global define*/
define(['board', 'numpad', 'events', 'viewstate', 'utils', 'onload'],
    function(board, numpad, events, viewstate, utils, load) {

    var eventDispatcher = events.dispatcher;
    var flattenArray = utils.flattenArray;

    function Game(boardControllerInput) {
        // moves is a stack of triples row, col, valid 
        // row, col are integers and valid is a bool
        //  e.g. { row: i, col: j, valid: bool}
        var moves = [];
        var boardController = boardControllerInput;
        var controller = new GameController(this);
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
        return arr.every(function(num) {
            if (map[num]) {
                return false;
            } else {
                map[num] = true;
                return true;
            }
        });
    }

    Game.prototype.moveIsVaild = function(row, col) {
        var model = this.boardController.model;
        var subrow = Math.floor(row / 3);
        var subcol = Math.floor(col / 3);
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
        
        this.pushMove(row, col, this.moveIsVaild(row, col));

        if (this.isBoardWin) {
            this.handleWin();
        }
    };

    Game.prototype.handleWin = function() {
        window.alert('You win!');
        eventDispatcher.emit('win');
    };

    function GameController(gameInstance) {
        var game = gameInstance;
        Object.defineProperties(this, {
            'game': {
                get: function(){
                    return game;
                }
            }
        });
        this.init();
    }

    GameController.prototype.init = function() {
        var game = this.game;
        var undoButton = load.undoButtonPromise.value();

        $(undoButton).on({
            click: function(){
                var move = game.popMove();
                console.log(game.moves);
                console.log(move);
                if (move) {
                    eventDispatcher.emit('undo', move.row, move.col);
                }
            }
        });

        eventDispatcher.addListener('move', function(row, col){
            game.handleMove(row, col);
        });

        this.initViewState();

    };

    GameController.prototype.initViewState = function() {
        var undoButton = load.undoButtonPromise.value();
        var onPress = viewstate.menu.onPress;
        var offPress = viewstate.menu.offPress;
        var onHover = viewstate.menu.onHover;
        var offHover = viewstate.menu.offHover;
        
        $(undoButton).on({
            mouseenter: onHover,
            mouseleave: offHover,
            mousedown: onPress,
            mouseup: offPress
        });
    };

    return {
        construct: Game,
        controller: GameController
    };
});