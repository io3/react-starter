/**
 * http://webpack.github.io/docs/
 */
import path from 'path';
import webpack from 'webpack';
import yargs from 'yargs';
import autoprefixer from 'autoprefixer';

import constants from '../config/constants';
import autoprefixerBrowsers from '../config/autoprefixerBrowsers';

const argv = yargs.argv;
const IS_DEVELOPMENT = constants.IS_DEVELOPMENT; // 是否开发环境
const CSS_SOURCE_MAP = argv.cssSourceMap;
const WATCH = global.WATCH === undefined ? false : global.WATCH; // 是否开启热加载
const SERVER_IP = constants.HOT_RELOAD_IP;

// entry
let entry = {
    'apps/app1/js/app': path.join(constants.SRC_DIR, 'js/apps/app1/app.js'),

    'apps/app1/js/app-css': path.join(constants.SRC_DIR, 'js/apps/app1/default/css.js'),
};

for (let key of (Object.keys(entry))) {
    entry[ key ] = [
        ...(WATCH ? [ `webpack-hot-middleware/client?path=http://${SERVER_IP}:${constants.HOT_RELOAD_PORT}/__webpack_hmr` ] : []),
        entry[ key ]
    ];
}

// Choose a developer tool to enhance debugging
// http://webpack.github.io/docs/configuration.html#devtool
// sourcemap默认开启
// inline-source-map, eval
const devtool = IS_DEVELOPMENT ? 'eval' : false;

const config = {
    entry: entry,

    output: WATCH ? {
        path: constants.BUILD_ASSETS_DIR,
        filename: '[name].js',
        chunkFilename: '[id]-[name].js',
        publicPath: `http://${SERVER_IP}:${constants.HOT_RELOAD_PORT}/`
    } : {
        path: constants.BUILD_ASSETS_DIR,
        filename: '[name].js',
        chunkFilename: 'chunk/[id]-[name]-[chunkhash].js',
        publicPath: './assets/'
    },

    hotPort: constants.HOT_RELOAD_PORT,

    cache: IS_DEVELOPMENT,
    debug: IS_DEVELOPMENT,

    devtool: devtool,

    stats: {
        colors: true,
        reasons: IS_DEVELOPMENT
    },

    resolve: {
        root: constants.ABSOLUTE_BASE,
        alias: {
            'app-core': path.resolve(constants.SRC_DIR, 'apps/app-core'),
            'auth': path.resolve(constants.SRC_DIR, 'apps/auth'),

        },
        /* modulesDirectories: ['node_modules', 'web_modules'], */
        extensions: [ '', '.webpack.js', '.web.js', '.js', '.jsx' ]
    },

    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                include: [
                    constants.SRC_DIR
                ],
                loader: 'babel-loader',
                query: !WATCH ? {} : {
                    // If cacheDirectory is enabled, it throws:
                    // Uncaught Error: locals[0] does not appear to be a `module` object with Hot Module replacement API enabled.
                    // cacheDirectory: true,
                    env: {
                        development: {
                            // Wraps all React components into arbitrary transforms
                            // https://github.com/gaearon/babel-plugin-react-transform
                            // react-transform belongs to webpack config only, not to .babelrc
                            plugins: [ 'react-transform' ],
                            extra: {
                                'react-transform': {
                                    transforms: [ {
                                        transform: 'react-transform-hmr',
                                        imports: [ 'react' ],
                                        locals: [ 'module' ]
                                    }, {
                                        transform: 'react-transform-catch-errors',
                                        imports: [ 'react', 'redbox-react' ]
                                    } ]
                                }
                            }
                        }
                    }
                }
            },
            { test: /\.txt$/, loader: 'file-loader?name=file/[path][name].[ext]' },
            {
                test: /\.gif$/,
                loader: 'url-loader?name=images/[hash].[ext]&limit=10000&mimetype=image/gif'
            },
            {
                test: /\.jpg$/,
                loader: 'url-loader?name=images/[hash].[ext]&limit=10000&mimetype=image/jpg'
            },
            {
                test: /\.png$/,
                loader: 'url-loader?name=images/[hash].[ext]&limit=10000&mimetype=image/png'
            },
            {
                test: /\.svg(\?\S*)?$/,
                loader: 'url-loader?name=images/[hash].[ext]&limit=10000&mimetype=image/svg+xml'
            },
            {
                test: /\.eot(\?\S*)?$/,
                loader: 'url-loader?name=fonts/[hash].[ext]&limit=100000&mimetype=application/vnd.ms-fontobject'
            },
            {
                test: /\.woff2(\?\S*)?$/,
                loader: 'url-loader?name=fonts/[hash].[ext]&limit=100000&mimetype=application/font-woff2'
            },
            {
                test: /\.woff(\?\S*)?$/,
                loader: 'url-loader?name=fonts/[hash].[ext]&limit=100000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf(\?\S*)?$/,
                loader: 'url-loader?name=fonts/[hash].[ext]&limit=100000&mimetype=application/font-ttf'
            },
            ...(
                CSS_SOURCE_MAP ? [
                    {
                        test: /\.css$/,
                        exclude: /\.useable\.css$/,
                        loader: 'style-loader!css-loader?sourceMap'
                    },
                    { test: /\.useable\.css$/, loader: 'style-loader!css-loader?sourceMap' },
                    {
                        test: /\.(scss|sass)$/,
                        exclude: /\.useable\.(scss|sass)$/,
                        loader: 'style-loader!css-loader?sourceMap!postcss-loader!sass-loader?sourceMap'
                    },
                    {
                        test: /\.useable\.(scss|sass)$/,
                        loader: 'style-loader/useable!css-loader?sourceMap!postcss-loader!sass-loader?sourceMap'
                    },
                    {
                        test: /\.less$/,
                        loader: 'style-loader!css-loader?sourceMap!less-loader?sourceMap'
                    }
                ] : [
                    {
                        test: /\.css$/,
                        exclude: /\.useable\.css$/,
                        loader: 'style-loader!css-loader'
                    },
                    { test: /\.useable\.css$/, loader: 'style-loader!css-loader' },
                    {
                        test: /\.(scss|sass)$/,
                        exclude: /\.useable\.(scss|sass)$/,
                        loader: 'style-loader!css-loader!postcss-loader!sass-loader'
                    },
                    {
                        test: /\.useable\.(scss|sass)$/,
                        loader: 'style-loader/useable!css-loader!postcss-loader!sass-loader'
                    },
                    { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }
                ]
            ),
        ],
        noParse: [ 'jquery' ]
    },

    postcss: () => [ autoprefixer({ browsers: autoprefixerBrowsers }) ],

    /**
     * 使用外部package
     */
    externals: {
        /* react: {
         root: 'React',
         commonjs: 'react',
         commonjs2: 'react',
         amd: 'react'
         },
         jquery: {
         root: 'jQuery',
         commonjs: 'jquery',
         commonjs2: 'jquery',
         amd: 'jquery'
         } */
    },

    plugins: [
        ...(argv.stats ? [
            function () {
                this.plugin('done', function (stats) {
                    let jsonStats = stats.toJson();
                    let statsPath = path.join(constants.BUILD_ASSETS_DIR, 'stats.json');
                    console.info('stats path: ' + statsPath);
                    require('fs').writeFileSync(statsPath, JSON.stringify(jsonStats));
                });
            }
        ] : []),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(IS_DEVELOPMENT ? 'development' : 'production'),
                IS_BROWSER: true,
                __DEV__: IS_DEVELOPMENT,
                DEV_HOT_RELOAD: WATCH
            }
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery'
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            // process all children of the main chunk
            // if omitted it would process all chunks
            name: 'main',
            // create a additional async chunk for the common modules
            // which is loaded in parallel to the requested chunks
            async: true
        }),
        ...(IS_DEVELOPMENT ? [] : [ // 发布时压缩
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    // Because uglify reports so many irrelevant warnings.
                    warnings: false
                }
            })
        ]),
        ...(WATCH ? [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
        ] : []),
        /* new webpack.optimize.CommonsChunkPlugin(/!* chunkName= *!/'vendor', /!* filename= *!/'vendor.js') */
    ]
};

export default config;
