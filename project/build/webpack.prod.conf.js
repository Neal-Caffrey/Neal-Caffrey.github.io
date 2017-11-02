var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var exitNodeModules = function (files) {
    if (!/\/local-/.test(files) && /\/node_modules\//.test(files)) return files;
    return '';
};
var ExtractTextPlugin = require('extract-text-webpack-plugin')
// var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
var extractCSS = new ExtractTextPlugin("static/css/[name].[hash].css");
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = merge(baseWebpackConfig, {
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        publicPath: config.build.assetsPublicPath,
        filename: 'static/js/[name].[hash].js'
    },
    plugins: [
        extractCSS,
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true
            }
        }),
        /* new ParallelUglifyPlugin({
            cacheDir: '.cache/',
            uglifyJS: {
                output: {
                    comments: false
                },
                compress: {
                    warnings: false
                }
            }
        }), */
        new webpack.optimize.OccurrenceOrderPlugin(), // generate dist index.html with correct asset hash for caching.
        // new BundleAnalyzerPlugin()
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            exclude: exitNodeModules,
            options: {
                presets: ['es2015', 'react', 'stage-0'],
                plugins: [
                    ["import", {
                        "libraryName": "local-Antd",
                        "libraryDirectory": "src", // default: lib
                        "style": false
                    },]
                ]
            }


        }]
    }
})
