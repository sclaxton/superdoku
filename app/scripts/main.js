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

require(['zepto', 'eventEmitter', 'onload', 'board', 'game'],
    function($, EventEmitter, onload, board, game) {

});