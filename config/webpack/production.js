
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBaseConfig = require('./Base')
const chalk = require('chalk')

function showEnvironment () {
  var str = `
  ########################################################################################
  _______  ______    _______  ______   __   __  _______  _______  ___   _______  __    _ 
 |       ||    _ |  |       ||      | |  | |  ||       ||       ||   | |       ||  |  | |
 |    _  ||   | ||  |   _   ||  _    ||  | |  ||       ||_     _||   | |   _   ||   |_| |
 |   |_| ||   |_||_ |  | |  || | |   ||  |_|  ||       |  |   |  |   | |  | |  ||       |
 |    ___||    __  ||  |_|  || |_|   ||       ||      _|  |   |  |   | |  |_|  ||  _    |
 |   |    |   |  | ||       ||       ||       ||     |_   |   |  |   | |       || | |   |
 |___|    |___|  |_||_______||______| |_______||_______|  |___|  |___| |_______||_|  |__|
                            
 ########################################################################################
  `
  console.log(chalk.cyanBright.bold(str))
}

class WebpackDistConfig extends WebpackBaseConfig {
  constructor () {
    super()

    showEnvironment()

    this.config = {
      cache: false,
      // entry: [
      //   './index.js'
      // ],
      entry: {
        main: './index.js',
        // 將很少變化的常用庫（react、lodash、redux）等與業務代碼分割
        // 可以避免在更板時，用戶端又再次取得相同檔案造成 Server 端資源耗費
        vendor: [
          'react'
        ]
      },
      // 加入 default 的 plugins 設定
      plugins: this.defaultSettings.plugins.concat([
        // new CleanWebpackPlugin(['dist']), // chris add
        // https://foio.github.io/wepack-code-spliting/
        // 使用CommonsChunkPlugin提取代碼到新的chunk時，會將webpack運行時(Runtime)也提取到打包後的新的chunk
        // 這樣會造成所有chunk檔案都被異動，因此需通過如下配置就可以將webpack的runtime單獨提取出來
        // 另外由於webpack的runtime比較小，我們可以考慮直接將該文件的內容inline到html中(還沒做)
        // new webpack.optimize.CommonsChunkPlugin({
        //   names: ['vendor', 'runtime']
        // }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'runtime'
        }),
        new webpack.EnvironmentPlugin({
          NODE_ENV: 'production'
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new HtmlWebpackPlugin({
          template: 'index.html',
          filename: '../index.html',
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
          }
        })
        // new webpack.NoErrorsPlugin()
      ])
    }

    // Deactivate hot-reloading if we run dist build on the dev server
    // this.config.devServer.hot = false;
  }

  /**
   * Get the environment name
   * @return {String} The current environment
   */
  get env () {
    return 'production'
  }
}

module.exports = WebpackDistConfig
