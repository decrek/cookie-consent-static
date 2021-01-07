require('dotenv').config()
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  mode: process.env.NODE_ENV !== 'dev' ? 'production' : 'development',
  entry: {
    'service-worker': './src/service-worker.js',
    'js/main': './src/index.js',
    'css': './src/index.scss'
  },
  output: {
    publicPath: '/',
    filename: '[name].js'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
    ]),
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            }
          },
          'sass-loader'
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
    ]
  },
  optimization: {
    minimize: process.env.NODE_ENV !== 'dev',
    minimizer: [new TerserPlugin({ extractComments: false, }), new OptimizeCSSAssetsPlugin()],
  },
}
