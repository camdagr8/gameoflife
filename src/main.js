/**
 * Game of life example
 */
const GameOfLife = require(__dirname + '/lib/GameOfLife.js');
//const log = console.log.bind(console);

window.startCells = [
    [0, 6],
    [1, 0], [1, 1], [1, 2], [1, 6],
    [2, 6],
    [4, 3], [4, 4],
    [5, 3], [5, 4]
];

window.game = null;

$(function () {

    const stopGame = function () {
        $(this).hide();

        let form = $('#game-form');
        let sbtn = form.find('button');
        sbtn.removeAttr('disabled');

        if (window.game !== null) {
            $('#'+window.game.element).removeClass('active');
            window.game.stop();
        }
    };

    const drawCanvas = function(gol) {
        let canvas    = document.getElementById(gol.element);
        let ctx       = canvas.getContext('2d');
        let x         = 0;
        let y         = 0;
        let w         = 50;
        let h         = 50;

        canvas.width = w * gol.columns;
        canvas.height = h * gol.rows;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let r = 0; r < gol.rows; r++) {
            x = 0;

            for (let c = 0; c < gol.columns; c++) {
                ctx.beginPath();
                ctx.fillStyle = (gol.state[r][c] === 1) ? '#C9302C' : 'white';
                ctx.fillRect(x, y, w, h);
                ctx.closePath();
                x += w;
            }

            y += h;
        }

        $(canvas).addClass('active');

        $('#btn-stop').css('width', canvas.width + 'px')
        .css('margin-top', canvas.height / 2 + 20)
        .css('display', 'block');

    };

    $('#grid-modal').on('submit', function (e) {
        e.preventDefault();

        let vals = [];
        $(this).find('input:checked').each(function () {
            vals.push(JSON.parse($(this).val()));
        });

        startCells = vals;

        $(this).modal('hide');
    });

    $('#game-form').on('submit', function (e) {
        e.preventDefault();

        let form      = $(this);
        let cols      = form.find('input[name="columns"]:checked').val();
        let rows      = form.find('input[name="rows"]:checked').val();
        let sbtn      = form.find('button');
        let canvas    = form.data('target');

        sbtn.attr('disabled', true);

        if (window.game !== null) {
            window.game.stop();
            window.game = null;
        }

        window.game = new GameOfLife(cols, rows, window.startCells);
        window.game.freq = 250;
        window.game.element = canvas;

        drawCanvas(window.game);

        setTimeout(function () { window.game.start(); }, 1000);
    });

    $('[data-select]').on('change', function () {
        let v = $(this).val();
        let n = $(this).attr('name');
        let lbl = [v, n].join(' ');

        let btn = $($(this).data('select'));
        $(this).closest('.dropdown-menu').find('.active').removeClass('active');
        $(this).parent().addClass('active');

        btn.html(lbl);
    });

    $('#show-grid-modal').on('click', function () {
        let form = $('#game-form');
        let cols = form.find('input[name="columns"]:checked').val();
        let rows = form.find('input[name="rows"]:checked').val();
        let modal = $('#grid-modal');
        let mbody = $('#grid-modal .modal-body');

        mbody.html('');

        for (let r = 0; r < rows; r++) {
            let row = [];

            for (let c = 0; c < cols; c++) {
                let checked = '';

                for (let s = 0; s < startCells.length; s++) {
                    let cr = startCells[s][0];
                    let cc = startCells[s][1];
                    if (cr === r && cc === c) {
                        checked = 'checked="checked"';
                        break;
                    }
                }

                let col = `<input type="checkbox" name="selection" value="[${r}, ${c}]" ${checked} />`;
                row.push(col);
            }

            mbody.append('<div class="check-row">'+row.join('')+'</div>');
        }

        modal.modal('show');
    });

    $('#canvas').on('next', function (e) {
        drawCanvas(e.detail);
    });

    $('#btn-stop').on('click', stopGame);
});