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

require(['zepto', 'events', 'onload', 'board', 'game', 'numpad', 'viewstate', 'modelstate'],
    function($, events, load, board, game, numpad, viewstate, modelstate) {

    var eventDispatcher = events.dispatcher;
    var boardNodesPromise = load.boardNodesPromise;
    var numpadNodesPromise = load.numButtonsPromise;
    var focusOutSelectionPromise = load.focusOutSelectionPromise;

    var BoardData = board.data;
    var BoardView = board.view;
    var BoardController = board.controller;

    var NumpadView = numpad.view;
    var NumpadController = numpad.controller;

    var Game = game.construct;

    var boardData = modelstate.boardData;

    var boardModel = new BoardData(boardData);
    var boardView, boardController, newGame, numpadView, numpadController;

    function main() {
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
        $(boardNodesPromise.value()).off();
        $(numpadNodesPromise.value()).off();
    }

    function teardown() {
        destroyHandlers();
        eventDispatcher.removeAllListeners();
    }

    function restart(){
        teardown();
        main();
    }

    load.resetButtonPromise.then(function($reset){
        $reset.on({
            click: restart,
            mouseenter: viewstate.menu.onHover,
            mouseleave: viewstate.menu.offHover,
            mousedown: viewstate.menu.onPress,
            mouseup: viewstate.menu.offPress
        });
    });

    main();



});