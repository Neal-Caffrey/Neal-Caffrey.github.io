var path = require('path')
var config = require('../config')
var StringReplacePlugin = require("string-replace-webpack-plugin")

exports.assetsPath = function (_path) {
  return path.posix.join(config.build.assetsSubDirectory, _path)
}

exports.StringReplacePlugin = function () {
  return StringReplacePlugin
}
