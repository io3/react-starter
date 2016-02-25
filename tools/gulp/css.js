import webpack from 'webpack';

function buildCss(gulp, argv, $) {
    gulp.task('build-css', function (callback) {
        let verbose = !!argv.verbose;
        let config = require('../webpack/webpack.config.css');
        webpack(config, function (err, stats) {
            if (err) {
                throw new $.util.PluginError('webpack', err);
            }

            $.util.log(stats.toString({
                colors: $.util.colors.supportsColor,
                hash: verbose,
                version: verbose,
                timings: verbose,
                chunks: false,
                chunkModules: false,
                cached: false,
                cachedAssets: false
            }));

            callback();
        });
    });
}

export default buildCss;
