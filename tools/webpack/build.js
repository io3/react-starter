import gutil from 'gulp-util';
import webpackConfig from './webpack.config';
import webpack from 'webpack';
import constants from '../config/constants';

export default function build(callback) {
    webpack(webpackConfig, (fatalError, stats) => {
        const jsonStats = stats.toJson();

        // We can save jsonStats to be analyzed with
        // http://webpack.github.io/analyse or
        // https://github.com/robertknight/webpack-bundle-size-analyzer.
        // import fs from 'fs';
        // fs.writeFileSync('./bundle-stats.json', JSON.stringify(jsonStats));

        const buildError = fatalError || jsonStats.errors[0] || jsonStats.warnings[0];

        if (buildError) {
            throw new gutil.PluginError('webpack', buildError);
        }

        let colors = constants.IS_DEVELOPMENT;

        gutil.log('[webpack]', stats.toString({
            colors: colors,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        }));

        callback();
    });
}
