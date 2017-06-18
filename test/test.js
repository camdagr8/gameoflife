const should        = require('chai').should();
const GameOfLife    = require('../lib/GameOfLife.js');

describe('GameOfLife.next()', function () {
    let cells = [
        [0, 6],
        [1, 0], [1, 1], [1, 2], [1, 6],
        [2, 6],
        [4, 3], [4, 4],
        [5, 3], [5, 4]
    ];
    let finalState = JSON.stringify([[0,1,0,0,0,0,0,0],[0,1,0,0,0,1,1,1],[0,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,1,1,0,0,0],[0,0,0,1,1,0,0,0]]);

    const gol = new GameOfLife(8, 6, cells);
    const state = gol.next();

    it('GameOfLife.next()', function() {
        console.log("\n   ", "prev:", state.prev);
        console.log("   ", "next:", state.next, "\n");
        state.next.should.equal(finalState);
    });
});