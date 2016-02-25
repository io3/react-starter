import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import runSequence from 'run-sequence';
import yargs from 'yargs';
import path from 'path';

import constants from '../config/constants';

const $ = gulpLoadPlugins();

const argv = yargs.argv;

// Settings

let src = {};

// The default task
gulp.task('default', ['server']);

// Clean output directory
gulp.task('clean', del.bind(
    null, [
        path.join(constants.SRC_DIR, '.tmp'),
        path.join(constants.BUILD_ASSETS_DIR, '/*')
    ], {
        force: true,
        dot: true
    }
));

// Static files
gulp.task('assets', function () {
    src.assets = [
        path.join(constants.ASSETS_DIR, '/**/*.*'),
        '!' + path.join(constants.ASSETS_DIR, '/**/*.scss'),
        '!' + path.join(constants.ASSETS_DIR, '/package.json')
    ];
    return gulp.src(src.assets)
        .pipe($.changed(constants.BUILD_ASSETS_DIR))
        .pipe(gulp.dest(constants.BUILD_ASSETS_DIR))
        .pipe($.size({ title: 'assets' }));
});

gulp.task('public', function () {
    src.public = [
        path.join(constants.SRC_DIR, 'public/**/*.*')
    ];
    return gulp.src(src.public)
        .pipe($.changed(constants.BUILD_DIR))
        .pipe(gulp.dest(constants.BUILD_DIR))
        .pipe($.size({ title: 'public' }));
});

gulp.task('html', function () {
    const WATCH = global.WATCH === undefined ? false : global.WATCH; // 是否开启热加载
    let baseUrl = WATCH ? `//${constants.HOT_RELOAD_IP}:${constants.HOT_RELOAD_PORT}/` : './assets/';

    src.pages = [
        path.join(constants.SRC_DIR, 'pages/**/*.*')
    ];
    return gulp.src(src.pages)
        .pipe($.replace('<%= BUILD_TIME %>', 'BUILD_TIME: ' + new Date().toLocaleString()))
        .pipe($.replace('<%= INDEX_SCRIPT %>', `${baseUrl}apps/app1/js/app.js`))
        .pipe($.replace('<%= INDEX_SCRIPT_CSS %>', `${baseUrl}apps/app1/js/app-css.js`))
        .pipe(gulp.dest(constants.BUILD_DIR))
        .pipe($.size({ title: 'html' }));
});

// Bundle
gulp.task('webpack', function (cb) {
    let build = require('../webpack/build');
    build(cb);
});

// Bundle
gulp.task('webpack:watch', function (cb) {
    let server = require('../webpack/server');
    server(cb);
});

// Build the app from source code
gulp.task('build', ['clean'], function (cb) {
    runSequence(['webpack', 'assets', 'html', 'public'], cb);
});

// Build and start watching for modifications
gulp.task('build:watch', ['clean'], function (cb) {
    runSequence(['webpack:watch', 'assets', 'html', 'public'], function () {
        gulp.watch(src.assets, ['assets']);
        gulp.watch(src.pages, ['html']);
        gulp.watch(src.public, ['public']);
        cb();
    });
});

require('./css')(gulp, argv, $);

// sync
gulp.task('server', ['build:watch'], function (cb) {

});
