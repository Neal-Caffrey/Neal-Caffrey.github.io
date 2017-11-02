var path = require('path')
var express = require('express')
var webpack = require('webpack');
var fs = require('fs');
var http = require('http');
var https = require('https');
var config = require('../config')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

var httpType =  process.env.NODE_SERVER === 'https';

// default port where dev server listens for incoming traffic
var port = process.env.PORT || ((httpType && config.dev.httpsPort) || config.dev.httpPort);
var type = (httpType && 'https') || 'http';
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable;

console.log('server type: %s', type);
console.log('server port: %s', port);

var privateKey  = fs.readFileSync('./hbc.key', 'utf8');
var certifiCate = fs.readFileSync('./hbc.crt', 'utf8');
var certifiCa = fs.readFileSync('./ca.crt', 'utf8');

var credentials = {
  key: privateKey, 
  cert: certifiCate,
};

var app = express()
var compiler = webpack(webpackConfig)
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.build.assetsPublicPath, config.build.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var httpServer = httpType ? https.createServer(credentials, app) : http.createServer(app);

httpServer.listen(port, function(){
  console.log('Listening at %s://localhost:%s\n', type, port);
});