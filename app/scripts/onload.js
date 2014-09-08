'use strict';

// module exposes a collection of Promises for computations
// that require directly referencing the dom. this allows
// the rest of the app to be more decoupled from the dom
// and how long it takes it to load

/*global define*/ 
define(['zepto', 'bluebird'], function(zepto, Promise) {

    var squaresDivClass = '.expandable';
    var numButtonsClass = '.num-button';


    function promiseDOM(resultFunction) {
        // we want to return a promise that resolves to a
        // value we computed by accessing the dom
        return new Promise(function(resolve, reject) {
            // wrap in a Zepto call to wait until
            // the dom fully loads
            zepto(function($) {
                resolve(resultFunction($));
            });
        });
    }

    var squareNodes = promiseDOM(function($) {
        var ret = [];
        // get all the squares then build up
        // the nested array that we want
        var squares = $(squaresDivClass).get();
        for (var i = 0; i < 3; i++) {
            var subrow = [];
            ret.unshift(subrow);
            for (var j = 0; j < 3; j++) {
                var subsquare = [];
                subrow.unshift(subsquare);
                for (var k = 0; k < 3; k++) {
                    var row = squares.splice(0, 3);
                    subsquare.unshift(row);
                }
            }
        }
        // return result to be resolved in promise
        return ret;
    });


    var numButtons = promiseDOM(function($) {
        var ret = [];
        var buttons = $(numButtonsClass).get();
        for (var i = 0; i < 3; i++) {
            var rowButtons = buttons.splice(0, 3);
            ret.unshift(rowButtons);
        }
        return ret;
    });

    return {
        squareNodes: squareNodes,
        numButtons: numButtons
    };
});