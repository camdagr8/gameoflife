/**
 *  Game of Life generator
 *  @author Cam Tullos - cam@tullos.ninja
 */
//const log = console.log.bind(console);

class GameOfLife {
    constructor(x, y, cells) {
        this.state      = [];
        this.future     = [];
        this.columns    = x;
        this.rows       = y;
        this.ival       = null;
        this.freq       = 1000;
        this.element    = null;

        for (let r = 0; r < this.rows; r++) {
            let row     = [];
            let frow    = [];

            for (let c = 0; c < this.columns; c++) {
                row.push(0);
                frow.push(0);
            }

            this.state.push(row);
            this.future.push(frow);
        }

        if (cells) {
            this.resurrect(cells);
        }

        return this;
    };

    clear() {
        // Clear the future grid
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                this.future[r][c] = 0;
            }
        }
    }

    resurrect(cells, clear) {
        let o = JSON.stringify(this.state);

        // Clear the future grid
        if (clear === true) {
            this.clear();
        }

        // Draw cells and update future grid
        cells.forEach((cell) => {
            let r = cell[0];
            let c = cell[1];
            this.future[r][c] = 1;
        });

        this.future.forEach((row, r) => {
            row.forEach((col, c) => {
                this.state[r][c] = this.future[r][c];
            });
        });

        let n = JSON.stringify(this.state);
    }

    next() {
        let prv = JSON.stringify(this.state);
        let alive = [];
        this.state.forEach((row, r) => {
            row.forEach((col, c) => {
                let cell = [r, c];

                if (this.fate(cell) === 1) {
                    alive.push(cell);
                }
            });
        });

        this.resurrect(alive, true);

        let nxt = JSON.stringify(this.state);
        let output = {prev: prv, next: nxt};

        if (this.element !== null) {
            let evt = new CustomEvent('next', {detail: this});
            let elm = document.getElementById(this.element);
            elm.dispatchEvent(evt);
        }

        if (nxt === prv) {

            this.stop();

            if (this.element !== null) {
                let evt = new CustomEvent('complete', {detail: this});
                let elm = document.getElementById(this.element);
                elm.dispatchEvent(evt);
            }
        }

        return output;
    }

    fate(cell) {

        let row      = cell[0];
        let col      = cell[1];

        let t        = row - 1;
        let b        = row + 1;
        let l        = col - 1;
        let r        = col + 1;

        let tl       = (t >= 0 && l >= 0) ? this.state[t][l] : 0;
        let tc       = (t >= 0) ? this.state[t][col] : 0;
        let tr       = (t >= 0 && r < this.columns) ? this.state[t][r] : 0;
        let lm       = (l >= 0) ? this.state[row][l] : 0;
        let rm       = (r < this.columns) ? this.state[row][r] : 0;
        let bl       = (b < this.rows && l >= 0) ? this.state[b][l] : 0;
        let bc       = (b < this.rows) ? this.state[b][col] : 0;
        let br       = (b < this.rows && r < this.columns) ? this.state[b][r] : 0;

        let total    = tl + tc + tr + lm + rm + bl + bc + br;

        // Dead cells
        if (this.state[row][col] === 0) {
            switch (total) {
                case 3:
                    return 1;
                    break;

                default:
                    return 0;
            }
        } else if (this.state[row][col] === 1) {
            switch (total) {
                case 0:
                case 1:
                    return 0;
                    break;

                case 2:
                case 3:
                    return 1;
                    break;

                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    return 0;
                    break;

                default:
                    return 0;
            }
        }

        return 0;
    }

    start(freq) {
        this.freq = (freq) ? freq : this.freq;
        this.stop();

        let me = this;

        this.ival = setInterval(function () {
            me.next();
        }, me.freq);
    }

    stop() {
        if (this.ival !== null) {
            clearInterval(this.ival);
        }
    }
}

module.exports = GameOfLife;