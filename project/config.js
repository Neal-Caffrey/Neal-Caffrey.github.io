// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var getPublibPath = function() {
  var res
  switch (process.env.NODE_ENV) {
    case 'dev':
      res = '/webapp/'
      break
    case 'test':
      res = '/webapp/'
      break
    case 'production':
      res = 'https://fr-static.huangbaoche.com/ydj-pc/'
      break
    default:
      res = '/webapp/'
  }
  console.log(res)
  return res
}
module.exports = {
  build: {
    index: path.resolve(__dirname, 'dist/index.html'),
    srcRoot: path.resolve(__dirname, 'src'),
    assetsRoot: path.resolve(__dirname, 'dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: getPublibPath(),
    productionSourceMap: false
  },
  dev: {
    httpPort: 8080,
    httpsPort: 443,
    proxyTable: {}
  }
}