const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const ENDPOINT_ENV = process.env.endpoint;

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'ENDPOINT_ENV': JSON.stringify(ENDPOINT_ENV)
            }
        })
    ]
});