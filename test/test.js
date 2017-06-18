const should        = require('chai').should();
const GameOfLife    = require('../src/lib/GameOfLife.js');

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
        let pr = JSON.parse(state.prev);
        let nx = JSON.parse(state.next);

        console.log("\n");
        pr.forEach((item, i) => {
            let n = nx[i].join('.');
            let p = pr[i].join('.');

            n = n.replace(/1/gi, '█').replace(/0/gi, ' ');
            p = p.replace(/1/gi, '█').replace(/0/gi, ' ');
            console.log("   ", "prev:", p, '->', n, ':next');
        });
        console.log("\n");

        state.next.should.equal(finalState);
    });
});