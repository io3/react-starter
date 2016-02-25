import path from 'path';
import yargs from 'yargs';
import gulpLoadPlugins from 'gulp-load-plugins';
import ip from 'ip';

const $ = gulpLoadPlugins();
const argv = yargs.argv;

const ABSOLUTE_BASE = path.normalize(path.join(__dirname, '../..'));
const BUILD_DIR = path.isAbsolute(argv.buildpath) ? argv.buildpath : path.join(ABSOLUTE_BASE, argv.buildpath || 'build');
const SRC_DIR = path.join(ABSOLUTE_BASE, 'src');

const constants = Object.freeze({
    ABSOLUTE_BASE,
    NODE_MODULES_DIR: path.join(ABSOLUTE_BASE, 'node_modules'),
    BUILD_DIR: BUILD_DIR, // 构建目录
    BUILD_ASSETS_DIR: path.join(BUILD_DIR, 'assets'), // 静态资源构建目录
    DIST_DIR: path.join(ABSOLUTE_BASE, 'dist'),
    SRC_DIR,
    ASSETS_DIR: path.join(SRC_DIR, 'assets'), // 静态资源目录
    HOT_RELOAD_IP: ip.address(),
    HOT_RELOAD_PORT: process.env.HOT_RELOAD_PORT || 8080,
    IS_DEVELOPMENT: !argv.production // 是否开发环境
});

$.util.log('argv', $.util.colors.magenta(JSON.stringify(argv)));

$.util.log('constants:');
for (let k of Object.keys(constants)) {
    $.util.log(k, $.util.colors.magenta(constants[k]));
}

export default constants;
