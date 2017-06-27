const should        = require('chai').should();
const GameOfLife    = require('../src/lib/GameOfLife.js');

const nextTest = function (columns, rows, cells, final) {
    columns    = columns || 8;
    rows       = rows || 6;
    cells      = cells || [
        [0, 6],
        [1, 0], [1, 1], [1, 2], [1, 6],
        [2, 6],
        [4, 3], [4, 4],
        [5, 3], [5, 4]
    ];

    final      = final || [[0,1,0,0,0,0,0,0],[0,1,0,0,0,1,1,1],[0,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,1,1,0,0,0],[0,0,0,1,1,0,0,0]];

    const gol = new GameOfLife(columns, rows, cells);

    let logger = `  GameOfLife.next(${columns}X${rows}) benchmark`;
    console.time(logger);
    let state = gol.next();
    console.timeEnd(logger);
    let finalState = JSON.stringify(final);

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
};
const cellTest = function (columns, rows, cell, cells, fate) {
    fate = (isNaN(fate)) ? 1 : fate;
    columns    = columns || 8;
    rows       = rows || 6;
    cell       = cell || [0, 1];
    cells      = cells || [
        [0, 6],
        [1, 0], [1, 1], [1, 2], [1, 6],
        [2, 6],
        [4, 3], [4, 4],
        [5, 3], [5, 4]
    ];

    it(`GameOfLife.fate()`, function() {
        const gol = new GameOfLife(columns, rows, cells);
        gol.next(); // Initial state
        gol.next(); // Next state
        gol.fate(cell).should.equal(fate);
    });
};

describe('GameOfLife.fate(8X6 | Cell: [0, 1] -> 1)', cellTest);
describe('GameOfLife.next(8X6)', nextTest);

describe('GameOfLife.fate(4X4 | Cell: [0, 0] -> 1)', function () {
    let cells = [
        [0, 1],
        [1, 0], [1, 1],
        [2, 2], [2, 3],
        [3, 2]
    ];

    cellTest(4, 4, [0, 0], cells, 1);
});
describe('GameOfLife.next(4X4)', function () {
    let cells = [
        [0, 1],
        [1, 0], [1, 1],
        [2, 2], [2, 3],
        [3, 2]
    ];

    let final = [[1,1,0,0],[1,1,0,0],[0,0,1,1],[0,0,1,1]];
    nextTest(4, 4, cells, final);
});

describe('GameOfLife.fate(10X10 | Cell: [4, 4] -> 0)', function () {
    let cells = [
        [4, 4],
        [5, 5]
    ];

    cellTest(10, 10, [4, 4], cells, 0);
});
describe('GameOfLife.next(10X10)', function () {
    let cells = [
        [4, 4],
        [5, 5]
    ];

    let final = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];
    nextTest(10, 10, cells, final);
});