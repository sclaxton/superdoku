'use strict';

// The events module exposes and initializes an event
// dispatcher, with predefined events

/*global define*/
define(['eventEmitter'], function(EventEmitter) {
    var dispatcher = new EventEmitter();

    dispatcher.defineEvents([
        'win',
        'move',
        'undo',
        'reset',
        'numpad',
        'modelUpdate',
        'selectSquare',
        'viewUpdate'
    ]);

    return {
        dispatcher: dispatcher
    };
});