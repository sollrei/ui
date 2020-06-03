const path = require('path');
const webpack = require('webpack');
const uglify = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  watch: true,
  watchOptions: {
    ignored: './src/script/',
  },
  entry: {
    ui: './src/index.es6'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.scss$/i,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer()]
          }
        },
        'sass-loader',
      ]
    }, {
      test: /\.es6$/,
      loader: 'babel-loader',
      query: {
          presets: ['es2015']
      }
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false
    }
  }
};

