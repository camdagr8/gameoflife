/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  Game of Life generator
 *  @author Cam Tullos - cam@tullos.ninja
 */
//const log = console.log.bind(console);

var GameOfLife = function () {
    function GameOfLife(x, y, cells) {
        _classCallCheck(this, GameOfLife);

        this.state = [];
        this.future = [];
        this.columns = x;
        this.rows = y;
        this.ival = null;
        this.freq = 1000;
        this.element = null;

        for (var r = 0; r < this.rows; r++) {
            var row = [];
            var frow = [];

            for (var c = 0; c < this.columns; c++) {
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
    }

    _createClass(GameOfLife, [{
        key: 'clear',
        value: function clear() {
            // Clear the future grid
            for (var r = 0; r < this.rows; r++) {
                for (var c = 0; c < this.columns; c++) {
                    this.future[r][c] = 0;
                }
            }
        }
    }, {
        key: 'resurrect',
        value: function resurrect(cells, clear) {
            var _this = this;

            var o = JSON.stringify(this.state);

            // Clear the future grid
            if (clear === true) {
                this.clear();
            }

            // Draw cells and update future grid
            cells.forEach(function (cell) {
                var r = cell[0];
                var c = cell[1];
                _this.future[r][c] = 1;
            });

            this.future.forEach(function (row, r) {
                row.forEach(function (col, c) {
                    _this.state[r][c] = _this.future[r][c];
                });
            });

            var n = JSON.stringify(this.state);
        }
    }, {
        key: 'next',
        value: function next() {
            var _this2 = this;

            var prv = JSON.stringify(this.state);
            var alive = [];
            this.state.forEach(function (row, r) {
                row.forEach(function (col, c) {
                    var cell = [r, c];

                    if (_this2.fate(cell) === 1) {
                        alive.push(cell);
                    }
                });
            });

            this.resurrect(alive, true);

            var nxt = JSON.stringify(this.state);
            var output = { prev: prv, next: nxt };

            if (this.element !== null) {
                var evt = new CustomEvent('next', { detail: this });
                var elm = document.getElementById(this.element);
                elm.dispatchEvent(evt);
            }

            if (nxt === prv) {

                this.stop();

                if (this.element !== null) {
                    var _evt = new CustomEvent('complete', { detail: this });
                    var _elm = document.getElementById(this.element);
                    _elm.dispatchEvent(_evt);
                }
            }

            return output;
        }
    }, {
        key: 'fate',
        value: function fate(cell) {

            var row = cell[0];
            var col = cell[1];

            var t = row - 1;
            var b = row + 1;
            var l = col - 1;
            var r = col + 1;

            var tl = t >= 0 && l >= 0 ? this.state[t][l] : 0;
            var tc = t >= 0 ? this.state[t][col] : 0;
            var tr = t >= 0 && r < this.columns ? this.state[t][r] : 0;
            var lm = l >= 0 ? this.state[row][l] : 0;
            var rm = r < this.columns ? this.state[row][r] : 0;
            var bl = b < this.rows && l >= 0 ? this.state[b][l] : 0;
            var bc = b < this.rows ? this.state[b][col] : 0;
            var br = b < this.rows && r < this.columns ? this.state[b][r] : 0;

            var total = tl + tc + tr + lm + rm + bl + bc + br;

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
    }, {
        key: 'start',
        value: function start(freq) {
            this.freq = freq ? freq : this.freq;
            this.stop();

            var me = this;

            this.ival = setInterval(function () {
                me.next();
            }, me.freq);
        }
    }, {
        key: 'stop',
        value: function stop() {
            if (this.ival !== null) {
                clearInterval(this.ival);
            }
        }
    }]);

    return GameOfLife;
}();

module.exports = GameOfLife;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Game of life example
 */
var GameOfLife = __webpack_require__(0);
//const log = console.log.bind(console);

window.startCells = [[0, 6], [1, 0], [1, 1], [1, 2], [1, 6], [2, 6], [4, 3], [4, 4], [5, 3], [5, 4]];

window.game = null;

$(function () {

    var stopGame = function stopGame() {
        $(this).hide();

        var form = $('#game-form');
        var sbtn = form.find('button');
        sbtn.removeAttr('disabled');

        if (window.game !== null) {
            $('#' + window.game.element).removeClass('active');
            window.game.stop();
        }
    };

    var drawCanvas = function drawCanvas(gol) {
        var canvas = document.getElementById(gol.element);
        var ctx = canvas.getContext('2d');
        var x = 0;
        var y = 0;
        var w = 50;
        var h = 50;

        canvas.width = w * gol.columns;
        canvas.height = h * gol.rows;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var r = 0; r < gol.rows; r++) {
            x = 0;

            for (var c = 0; c < gol.columns; c++) {
                ctx.beginPath();
                ctx.fillStyle = gol.state[r][c] === 1 ? '#C9302C' : 'white';
                ctx.fillRect(x, y, w, h);
                ctx.closePath();
                x += w;
            }

            y += h;
        }

        $(canvas).addClass('active');

        $('#btn-stop').css('width', canvas.width + 'px').css('margin-top', canvas.height / 2 + 20).css('display', 'block');
    };

    $('#grid-modal').on('submit', function (e) {
        e.preventDefault();

        var vals = [];
        $(this).find('input:checked').each(function () {
            vals.push(JSON.parse($(this).val()));
        });

        startCells = vals;

        $(this).modal('hide');
    });

    $('#game-form').on('submit', function (e) {
        e.preventDefault();

        var form = $(this);
        var cols = form.find('input[name="columns"]:checked').val();
        var rows = form.find('input[name="rows"]:checked').val();
        var sbtn = form.find('button');
        var canvas = form.data('target');

        sbtn.attr('disabled', true);

        if (window.game !== null) {
            window.game.stop();
            window.game = null;
        }

        window.game = new GameOfLife(cols, rows, window.startCells);
        window.game.freq = 250;
        window.game.element = canvas;

        drawCanvas(window.game);

        setTimeout(function () {
            window.game.start();
        }, 1000);
    });

    $('[data-select]').on('change', function () {
        var v = $(this).val();
        var n = $(this).attr('name');
        var lbl = [v, n].join(' ');

        var btn = $($(this).data('select'));
        $(this).closest('.dropdown-menu').find('.active').removeClass('active');
        $(this).parent().addClass('active');

        btn.html(lbl);
    });

    $('#show-grid-modal').on('click', function () {
        var form = $('#game-form');
        var cols = form.find('input[name="columns"]:checked').val();
        var rows = form.find('input[name="rows"]:checked').val();
        var modal = $('#grid-modal');
        var mbody = $('#grid-modal .modal-body');

        mbody.html('');

        for (var r = 0; r < rows; r++) {
            var row = [];

            for (var c = 0; c < cols; c++) {
                var checked = '';

                for (var s = 0; s < startCells.length; s++) {
                    var cr = startCells[s][0];
                    var cc = startCells[s][1];
                    if (cr === r && cc === c) {
                        checked = 'checked="checked"';
                        break;
                    }
                }

                var col = '<input type="checkbox" name="selection" value="[' + r + ', ' + c + ']" ' + checked + ' />';
                row.push(col);
            }

            mbody.append('<div class="check-row">' + row.join('') + '</div>');
        }

        modal.modal('show');
    });

    $('#canvas').on('next', function (e) {
        drawCanvas(e.detail);
    });

    $('#btn-stop').on('click', stopGame);
});

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map