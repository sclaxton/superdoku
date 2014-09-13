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
                'controller': {
                    get: function() {
                        return controller;
                    }
                }
            });
        }
        function containsUnique(arr) {
            var map = [];
            return arr.every(function(num) {
                if (num !== null) {
                    if (map[num]) {
                        return false;
                    } else {
                        map[num] = true;
                        return true;
                    }
                } else {
                    return true;
                }
            });
        }

        function val(el) {
            return el.value;
        }

        Game.prototype.boardIsVaild = function() {
            var model = this.boardController.model;
            var data = this.boardController.model.data;
            var subsquares = flattenArray(data);
            for (var i = 0; i < 9; i++) {
                var subsquare = flattenArray(subsquares[i], true).map(val);
                var row = model.row(i).map(val);
                var col = model.col(i).map(val);
                if (!(containsUnique(row) &&
                    containsUnique(col) &&
                    containsUnique(subsquare))) {
                    return false;
                }
            }
            return true;
        };

        Game.prototype.pushMove = function(row, col, val) {
            var pair = {
                row: row,
                col: col,
                val: val
            };
            this.moves.push(pair);
        };

        Game.prototype.popMove = function() {
            return this.moves.pop();
        };

        Game.prototype.lastMoveAtSquare = function(row, col) {
            var ret = this.moves.find(function(el) {
                return el.row === row && el.col === col;
            });
            return ret || {
                row: row,
                col: col,
                val: null
            };
        };

        Game.prototype.handleMove = function(row, col, val) {

            this.pushMove(row, col, val);

        };

        Game.prototype.handleWin = function() {
            window.alert('You win!');
            eventDispatcher.emit('win');
        };

        function GameController(gameInstance) {
            var game = gameInstance;
            Object.defineProperties(this, {
                'game': {
                    get: function() {
                        return game;
                    }
                }
            });
            this.init();
        }

        GameController.prototype.init = function() {
            var game = this.game;
            var undoButton = load.undoButtonPromise.value();
            var checkButton = load.checkButtonPromise.value();
            var pushNotification = viewstate.pushNotification;


            $(undoButton).on({
                click: function() {
                    var move = game.popMove();
                    if (move) {
                        var oldMove = game.lastMoveAtSquare(move.row, move.col);
                        eventDispatcher.emit('undo', move.row, move.col, oldMove.val);
                    }
                }
            });

            $(checkButton).on({
                click: function() {
                    if (game.boardIsVaild()) {
                        pushNotification('boardValid');
                    } else {
                        pushNotification('boardInvalid');
                    }
                }
            });

            eventDispatcher.addListener('move', function(row, col, val) {
                game.handleMove(row, col, val);
            });

            this.initViewState();

        };

        GameController.prototype.initViewState = function() {
            var undoButton = load.undoButtonPromise.value();
            var checkButton = load.checkButtonPromise.value();
            var onPress = viewstate.menu.onPress;
            var offPress = viewstate.menu.offPress;
            var onHover = viewstate.menu.onHover;
            var offHover = viewstate.menu.offHover;

            $([undoButton, checkButton]).on({
                mouseenter: onHover,
                mouseleave: function(e) {
                    offHover(e);
                    offPress(e);
                },
                mousedown: onPress,
                mouseup: offPress
            });
        };

        return {
            construct: Game,
            controller: GameController
        };
    });