const { merge } = require('webpack-merge')
const webpack = require('webpack')
const commentConfig = require('./webpack.common.js')
const { ESBuildMinifyPlugin } = require('esbuild-loader')

module.exports = merge(commentConfig, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'chrome80',
        css: true,
      }),
    ],
  },
  plugins: [
    // Mermaid lazy-loads diagram chunks; inline them so extension content scripts
    // can execute Mermaid in their isolated world instead of injecting page scripts.
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 3 }),
  ],
})
