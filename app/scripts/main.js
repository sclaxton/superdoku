'use strict';

require.config({
    baseUrl: './app/scripts',
    paths: {
        'zepto': 'vendor/zepto-full/zepto',
        'eventEmitter': 'vendor/eventEmitter/EventEmitter',
        'bluebird': 'vendor/bluebird/js/browser/bluebird',
    },
    shim: {
        'zepto': {
            deps: [],
            exports: 'Zepto'
        },
        'bluebird': {
            deps: [],
            exports: 'Promise'
        }
    }
});

require(['zepto', 'events', 'onload', 'board', 'game', 'numpad', 'viewstate', 'modelstate', 'utils'],
    function($, events, load, board, game, numpad, viewstate, modelstate, utils) {

        var eventDispatcher = events.dispatcher;
        var flattenArray = utils.flattenArray;
        var boardNodesPromise = load.boardNodesPromise;
        var boardNodesFlatPromise = boardNodesPromise.then(function(nodes) {
            return flattenArray(nodes, true);
        });
        var numpadNodesPromise = load.numButtonsPromise;
        var numpadNodesFlatPromise = numpadNodesPromise.then(function(nodes) {
            return flattenArray(nodes, true);
        });
        var focusOutSelectionPromise = load.focusOutSelectionPromise;
        var resetButtonPromise = load.resetButtonPromise;
        var checkButtonPromise = load.checkButtonPromise;
        var undoButtonPromise = load.undoButtonPromise;

        var BoardData = board.data;
        var BoardView = board.view;
        var BoardController = board.controller;

        var NumpadView = numpad.view;
        var NumpadController = numpad.controller;

        var Game = game.construct;

        var boardData = modelstate.boardData;

        var boardView, boardController, newGame, numpadView, numpadController, boardModel;

        function main() {

            boardModel = new BoardData(boardData);

            boardNodesPromise.then(function(nodes) {
                boardView = new BoardView(nodes, boardModel);
                boardController = new BoardController(boardView, boardModel);
                newGame = new Game(boardController);
            });

            numpadNodesPromise.then(function(nodes) {
                numpadView = new NumpadView(nodes);
                numpadController = new NumpadController(numpadView);
            });
        }

        function destroyHandlers() {
            $(focusOutSelectionPromise.value()).off();
            $(boardNodesFlatPromise.value()).off();
            $(numpadNodesFlatPromise.value()).off();
            $(checkButtonPromise.value()).off();
            $(undoButtonPromise.value()).off();
        }

        function teardown() {
            destroyHandlers();
            eventDispatcher.removeAllListeners();
        }

        function reset() {
            teardown();
            main();
            viewstate.unselectAll();
            eventDispatcher.emit('reset');
        }

        resetButtonPromise.then(function(button) {
            $(button).on({
                click: reset,
                mouseenter: viewstate.menu.onHover,
                mouseleave: viewstate.menu.offHover,
                mousedown: viewstate.menu.onPress,
                mouseup: viewstate.menu.offPress
            });
        });

        main();

    });