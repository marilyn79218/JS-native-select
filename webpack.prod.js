const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

const ENDPOINT_ENV = process.env.endpoint;

module.exports = merge(common, {
    // devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    }
                })
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