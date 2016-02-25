// http://webpack.github.io/docs/
import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import constants from '../config/constants';
import autoprefixerBrowsers from '../config/autoprefixerBrowsers';

const isDevelopment = constants.IS_DEVELOPMENT; // 是否开发环境

let cssConfigs = {
    'global/css': path.join(constants.SRC_DIR, 'global/css.js')
};

function makeConfig(name, src) {
    return {
        entry: {
            [name]: src
        },

        output: {
            path: path.join(constants.BUILD_ASSETS_DIR, name)
        },

        cache: isDevelopment,
        debug: isDevelopment,

        devtool: 'source-map',

        stats: {
            colors: true,
            reasons: isDevelopment
        },

        resolve: {
            root: constants.ABSOLUTE_BASE,
            alias: {
                'assets': constants.ASSETS_DIR
            },
            /* modulesDirectories: ['node_modules', 'web_modules'], */
            extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
        },

        module: {
            loaders: [
                {
                    test: /\.(js|jsx)$/,
                    include: [
                        constants.SRC_DIR
                    ],
                    loader: 'babel-loader'
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap')
                },
                {
                    test: /\.(scss|sass)$/,
                    loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!postcss-loader!sass-loader?sourceMap')
                },
                {
                    test: /\.less$$/,
                    loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!less-loader?sourceMap')
                },
                { test: /\.txt$/, loader: 'file-loader?name=[path][name].[ext]' },
                { test: /\.gif$/, loader: 'url-loader?limit=10000&mimetype=image/gif' },
                { test: /\.jpg$/, loader: 'url-loader?limit=10000&mimetype=image/jpg' },
                { test: /\.png$/, loader: 'url-loader?limit=10000&mimetype=image/png' },
                { test: /\.svg(\?\S*)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
                {
                    test: /\.eot(\?\S*)?$/,
                    loader: 'url-loader?limit=100000&mimetype=application/vnd.ms-fontobject'
                },
                {
                    test: /\.woff2(\?\S*)?$/,
                    loader: 'url-loader?limit=100000&mimetype=application/font-woff2'
                },
                {
                    test: /\.woff(\?\S*)?$/,
                    loader: 'url-loader?limit=100000&mimetype=application/font-woff'
                },
                {
                    test: /\.ttf(\?\S*)?$/,
                    loader: 'url-loader?limit=100000&mimetype=application/font-ttf'
                }
            ]
        },

        postcss: () => [autoprefixer({ browsers: autoprefixerBrowsers })],

        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(isDevelopment ? 'development' : 'production'),
                    IS_BROWSER: true,
                    __DEV__: isDevelopment
                }
            }),
            new ExtractTextPlugin('style.css', { // -[contenthash]
                allChunks: true
            })
        ]
    };
}

let configs = Object.keys(cssConfigs).map(name => makeConfig(name, cssConfigs[name]));

export default configs;
