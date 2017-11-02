var path = require('path')
var config = require('../config')
var utils = require('./utils')
var precss = require('precss')
var StringReplacePlugin = require("string-replace-webpack-plugin")
var webpack = require("webpack")
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var extractCSS = new ExtractTextPlugin("static/css/[name].[hash].css");
var autoprefixer = require('autoprefixer')
// var exitNodeModules = function(files) {
//   if (!/\/local-/.test(files) && /\/node_modules\//.test(files)) return files;
//   return '';
// };
var exitNodeModules = new RegExp(/node_modules/)
var compres = {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    minifyCSS: true,
    minifyJS: true
};
console.log(path.resolve(__dirname, '../src/components'))
module.exports = {
    entry: {
        // 'reactjs': ['react', 'react-dom', 'react-redux'],add
        'index': './src/static/index/index.js',
        'catering/list': './src/static/catering/list/index.js',
        'catering/detail': './src/static/catering/detail/index.js',
        'catering/orderList': './src/static/catering/orderList/index.js',
        'catering/orderDetail': './src/static/catering/orderDetail/index.js', //餐厅订单详情
        'catering/orderDetailForPay': './src/static/catering/orderDetailForPay/index.js', //餐厅订单详情,支付后跳转页
        'hotel/list': './src/static/hotel/list/index.js',
        'hotel/detail': './src/static/hotel/detail/index.js',
        'hotel/order': './src/static/hotel/order/index.js',
        'hotel/orderDetail': './src/static/hotel/orderDetail/index.js',
        'hotel/orderList': './src/static/hotel/orderList/index.js',
        'hotel/confirm': './src/static/hotel/confirm/index.js', //酒店确认单
        'hotel/settlement': './src/static/hotel/settlement/index.js', //酒店结算单
        'hotel/edit': './src/static/hotel/edit/index.js',
        'daily/index': './src/static/daily/index/index.js',
        'daily/orderFill': './src/static/daily/orderFill/index.js', //司兼导包车，填单页
        'setting/management': './src/static/accountSetting/management/index.js', //操作员设置
        'setting/myAccount': './src/static/accountSetting/myAccount/index.js',//我的账户
        'bills/upload': './src/static/bills/upload/upload.js', //上传图片
        'bills/list': './src/static/bills/list/index.js',
        'bills/detail': './src/static/bills/detail/index.js',
        'invoice/invoiceApplication': './src/static/invoice/invoiceApplication/index.js', //发票申请
        'invoice/list': './src/static/invoice/list/index.js',//发票列表
        'invoice/detail': './src/static/invoice/detail/index.js',//发票详情
        'invoice/fill': './src/static/invoice/fill/index.js', // 开票信息填写
        'invoice/edit': './src/static/invoice/fill/indexd.js', // 开票信息编辑
        'invoice/result': './src/static/invoice/result/index.js', // 开票信息申请结果
        'test': './src/static/test/index.js',
        'daily/guideIndex': './src/static/daily/guideIndex/index.js',//司导个人页
        'trip/orderList': './src/static/trip/orderList/index.js',//妙计 行程订单列表
        'trip/detail': './src/static/trip/detail/index.js',//妙计 行程订单
    },
    output: {
        path: config.build.assetsRoot,
        publicPath: config.build.assetsPublicPath,
        filename: '[name].js'
    },
    resolve: {
        alias: {
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'widgets': path.resolve(__dirname, '../src/widgets'),
            'components': path.resolve(__dirname, '../src/components'),
            'STORE': path.resolve(__dirname, '../src/store'),
            'REDUCERS': path.resolve(__dirname, '../src/reducers'),
            'ACTIONS': path.resolve(__dirname, '../src/action'),
            'contents': path.resolve(__dirname, '../src/contents')
        }
    },
    externals: {
        "react": 'React',
        'react-dom': 'ReactDOM',
        'react-redux': 'ReactRedux',
        'jQuery': '$'
    },
    resolveLoader: {},
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: exitNodeModules,
                options: {
                    presets: [
                        'es2015', 'react', 'stage-0'
                    ],
                    cacheDirectory: true,
                    plugins: [
                        [
                            "import", {
                                "libraryName": "local-Antd",
                                "libraryDirectory": "src", // default: lib
                                "style": false
                            }
                        ]
                    ]
                }

            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    loader: 'css-loader!postcss-loader'
                }),
                // exclude: exitNodeModules

            }, {
                test: /\.scss$/,
                // loader: ExtractTextPlugin.extract({
                //   fallback: 'style-loader',
                //   loader: 'css-loader!postcss-loader!sass-loader'
                // }),
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: 'css-loader',
                            options: {

                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function() {
                                    return [
                                        require('precss'),
                                        require('autoprefixer')({ browsers: ['> 0%'] })
                                    ];
                                }
                            }
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                }),
                // exclude: exitNodeModules
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                // exclude: exitNodeModules,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 2192,
                        name: path.posix.join('static', 'img/[name].[hash:16].[ext]')
                    }
                }]
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                // exclude: exitNodeModules,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: path.posix.join('static', 'fonts/[name].[hash:7].[ext]')
                    }
                }]
            }, {
                test: /\.html$/,
                loader: "html-loader",
                // exclude: exitNodeModules
            }, {
                test: /\.tpl$/,
                loader: "string-loader",
                // exclude: exitNodeModules
            }

        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: [
                'vendors', 'common'
            ], // 将公共模块提取，生成名为`vendors`的chunk
            chunks: [
                [
                    'index', 'hotel/detail', 'hotel/list', 'hotel/order'
                ],
                ['catering/detail', 'catering/list', 'catering/orderList', 'catering/orderDetail', 'catering/orderDetailForPay']
            ]
        }),
        // extractCSS,
        new StringReplacePlugin(),
        new HtmlWebpackPlugin({
            title: 'ydj-pc test',
            filename: 'test/index.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/test/index.html',
            chunks: ['test']
        }),
        new HtmlWebpackPlugin({
            title: 'ydj-m index',
            filename: 'index.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/index/index.html',
            chunks: ['vendors', 'index']
        }),
        // 预订酒店
        new HtmlWebpackPlugin({
            title: 'ydj-m hotel-list',
            filename: 'hotel/list.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/hotel/list.html',
            chunks: ['vendors', 'hotel/list']
        }),
        new HtmlWebpackPlugin({
            title: 'ydj-m hotel-detail',
            filename: 'hotel/detail.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/hotel/detail.html',
            chunks: ['vendors', 'hotel/detail']
        }),
        new HtmlWebpackPlugin({
            title: 'ydj-m hotel-order',
            filename: 'hotel/order.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/hotel/order.html',
            chunks: ['vendors', 'hotel/order']
        }),
        new HtmlWebpackPlugin({
            title: 'ydj-m hotel-order',
            filename: 'hotel/orderDetail.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/hotel/orderDetail.html',
            chunks: ['vendors', 'hotel/orderDetail']
        }),
        new HtmlWebpackPlugin({
            title: 'ydj-m hotel-order',
            filename: 'hotel/orderList.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/hotel/orderList.html',
            chunks: ['vendors', 'hotel/orderList']
        }),
        new HtmlWebpackPlugin({
            title: 'ydj-m hotel-order',
            filename: 'hotel/confirm.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/hotel/confirm.html',
            chunks: ['vendors', 'hotel/confirm']
        }),
        new HtmlWebpackPlugin({
            title: 'ydj-m hotel-order',
            filename: 'hotel/edit.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/hotel/edit.html',
            chunks: ['vendors', 'hotel/edit']
        }),
        // 订座
        new HtmlWebpackPlugin({
            title: 'ydj-m catering-detail',
            filename: 'catering/detail.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/catering/detail.html',
            chunks: ['catering/detail']
        }),
        new HtmlWebpackPlugin({
            title: 'ydj-m catering-order-list',
            filename: 'catering/orderList.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/catering/orderList.html',
            chunks: ['common', 'catering/orderList']
        }),
        new HtmlWebpackPlugin({
            title: 'ydj-m catering-list',
            filename: 'catering/list.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/catering/list.html',
            chunks: ['common', 'catering/list']
        }),
        //餐厅订单详情
        new HtmlWebpackPlugin({
            title: 'ydj-m catering-order-detail',
            filename: 'catering/orderDetail.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/catering/orderDetail.html',
            chunks: ['catering/orderDetail']
        }),
        //餐厅订单详情，支付后跳转
        new HtmlWebpackPlugin({
            title: 'ydj-m catering-order-detailForPay',
            filename: 'catering/payStatus.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/catering/orderDetail.html',
            chunks: ['catering/orderDetailForPay']
        }),
        //包车首页
        new HtmlWebpackPlugin({
            title: 'ydj-m catering-order-detailForPay',
            filename: 'daily/index.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/daily/index.html',
            chunks: ['daily/index']
        }),
        //包车测试
        new HtmlWebpackPlugin({
            title: 'ydj-m catering-order-detailForPay',
            filename: 'daily/testCar.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/daily/index.html',
            chunks: ['daily/testCar']
        }),
        //包车填单页
        new HtmlWebpackPlugin({
            title: 'daily/orderFill',
            filename: 'daily/orderFill.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/daily/orderFill.html',
            chunks: ['daily/orderFill']
        }),
        new HtmlWebpackPlugin({
            title: 'ydj-m hotel-order',
            filename: 'hotel/settlement.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/hotel/settlement.html',
            chunks: ['vendors', 'hotel/settlement']
        }),
        //操作员设置
        new HtmlWebpackPlugin({
            title: '操作员设置',
            filename: 'account/operator.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/accountSetting/index.html',
            chunks: ['setting/management']
        }),
        //我的账户
        new HtmlWebpackPlugin({
            title: '我的账户',
            filename: 'account/mine.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/accountSetting/index.html',
            chunks: ['setting/myAccount']
        }),
        // 上传图片
        new HtmlWebpackPlugin({
            title: '上传图片',
            filename: 'bills/upload.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/bills/index.html',
            chunks: ['bills/upload']
        }),
        new HtmlWebpackPlugin({
            title: '账单列表',
            filename: 'bills/list.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/bills/list.html',
            chunks: ['bills/list']
        }),
        new HtmlWebpackPlugin({
            title: '账单详情',
            filename: 'bills/detail.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/bills/detail.html',
            chunks: ['bills/detail']
        }),
        //发票申请
        new HtmlWebpackPlugin({
            title: 'ydj-m invoice-Application',
            filename: 'invoice/apply.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/invoice/invoiceApplication.html',
            chunks: ['invoice/invoiceApplication']
        }),
        //发票列表
        new HtmlWebpackPlugin({
            title: '发票列表',
            filename: 'invoice/list.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/invoice/list.html',
            chunks: ['invoice/list']
        }),
        //发票详情
        new HtmlWebpackPlugin({
            title: '发票详情',
            filename: 'invoice/detail.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/invoice/list.html',
            chunks: ['invoice/detail']
        }),
        // 开票信息填写
        new HtmlWebpackPlugin({
            title: 'ydj-m invoice',
            filename: 'invoice/fill.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/invoice/fill.html',
            chunks: ['invoice/fill']
        }),
        // 开票信息编辑
        new HtmlWebpackPlugin({
            title: 'ydj-m invoice',
            filename: 'invoice/edit.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/invoice/fill.html',
            chunks: ['invoice/edit']
        }),
        // 开票信息申请结果
        new HtmlWebpackPlugin({
            title: 'ydj-m invoice',
            filename: 'invoice/result.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/invoice/result.html',
            chunks: ['invoice/result']
        }),
        // 司导个人页
        new HtmlWebpackPlugin({
            title: '司导个人页',
            filename: 'daily/guideIndex.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/daily/guideIndex.html',
            chunks: ['daily/guideIndex']
        }),
        // 妙计订单列表
        new HtmlWebpackPlugin({
            title: '行程订单列表',
            filename: 'trip/orderList.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/trip/orderList.html',
            chunks: ['trip/orderList']
        }),
        new HtmlWebpackPlugin({
            title: '行程订单',
            filename: 'trip/detail.html',
            hash: false,
            inject: true,
            minify: compres,
            template: 'src/views/trip/tripOrder.html',
            chunks: ['trip/detail']
        }),
    ]
}
