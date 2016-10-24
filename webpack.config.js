'use strict';

let webpack = require('webpack');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    entry: {
        content: './src/content',
        popup: './src/popup'
    },
    output: {
        path: 'build',
        filename: '[name].js'
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'images', to: 'images' },
            { from: 'manifest.json'}
        ]),
        new HtmlWebpackPlugin({
            filename: 'popup.html',
            template: 'src/popup.html',
            chunks: ['popup']
        }),
    ],
    module: {
        preLoaders: [
            { test: /\.ts$/, loader: 'tslint' },
        ],
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' },
            { test: /\.css?$/, loader: 'style!css' },
            { test: /\.html$/, loader: 'html-loader' },
            { test: /\.(png|gif|jpg|ico)$/, loader: 'url-loader?limit=10000' },
            { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff2' },
            { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
        ]
    },
};