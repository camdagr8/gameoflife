'use strict';

const browserSync    = require('browser-sync').create();
const gulp           = require('gulp');
const gutil          = require('gulp-util');
const webpack        = require('webpack');

const config         = {
    dev        : gutil.env.dev,
    scripts    : {
        'assets/js/main': './src/main.js'
    }
};

// Webpack
const webpackConfig = require(__dirname + '/webpack.config')(config);

// Scripts
gulp.task('scripts', (done) => {
    webpack(webpackConfig, (err, stats) => {
        if (err) {
            gutil.log(gutil.colors.red(err()));
        }
        const result = stats.toJson();
        if (result.errors.length) {
            result.errors.forEach((error) => {
                gutil.log(gutil.colors.red(error));
            });
        }
        done();
    });
});

gulp.task('reload', (done) => {
    browserSync.reload();
    done();
});

gulp.task('scripts:watch', ['scripts'], function (done) {
    browserSync.reload();
    done();
});

// Static server
gulp.task('server', (done) => {
    browserSync.init({
        logPrefix: '00:00:00',
        notify: false,
        server: {
            baseDir: "./"
        }
    });
    done();
});

gulp.task('default', ['scripts'], (done) => {
    if (config.dev) {
        gulp.watch(['./main.js', './lib/**/*.js'], ['scripts:watch']);
        gulp.watch(['./*.html', './assets/**/*'], ['reload']);
        gulp.start('server');
    } else {
        done();
    }
});