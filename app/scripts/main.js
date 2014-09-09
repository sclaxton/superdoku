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
    var numpadNodesPromise = load.boardNodesPromise;

    var BoardData = board.data;
    var BoardView = board.view;
    var BoardController = board.controller;

    var NumpadView = numpad.view;
    var NumpadController = numpad.controller;

    var boardData = modelstate.boardData;

    var boardModel = new BoardData(boardData);
    var boardView, boardController, newGame, numpadView, numpadController;

    function main() {
        boardNodesPromise.then(function(nodes) {
            boardView = new BoardView(nodes);
            boardController = new BoardController(boardView, boardModel);
            newGame = new Game(boardController);
        });

        numpadNodesPromise.then(function(nodes) {
            numpadView = NumpadView(nodes);
            numpadController(numpadView);
        });
    }

    function teardown() {
        viewstate.destroyHandlers();
        eventDispatcher.removeListeners(/.*/);
    }

    function restart(){
        teardown();
        main();
    }

    load.resetButtonPromise.then(function($reset){
        $reset.on({
            click: restart,
            hover: viewstate.menu.onHover,
            mousedown: viewstate.menu.onPress,
            mouseup: viewstate.menu.offPress
        })
    });

    main();



});