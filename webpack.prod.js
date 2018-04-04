const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const autoprefixer = require('autoprefixer');

const ENDPOINT_ENV = process.env.endpoint;

module.exports = merge(common, {
    // devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    {
                        fallback: require.resolve('style-loader'),
                        use: [
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                    minimize: true,
                                },
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    // Necessary for external CSS imports to work
                                    // https://github.com/facebookincubator/create-react-app/issues/2677
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            browsers: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9', // React doesn't support IE8 anyway
                                            ],
                                            flexbox: 'no-2009',
                                        }),
                                        require('postcss-extend'),
                                        require('postcss-nested'),
                                        require('postcss-color-function'),
                                    ],
                                },
                            },
                        ],
                    }
                ),
                // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new UglifyJSPlugin(),
        new ExtractTextPlugin('[name].bundle.css'),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                'ENDPOINT_ENV': JSON.stringify(ENDPOINT_ENV)
            }
        })
    ]
});