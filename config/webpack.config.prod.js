'use strict';

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const { dist } = require('./paths');
const { getEntry, outputNames } = require('./utils');
const { getImageLoader, getStyleLoaders, getFileLoader } = require('./loaders');
const getBabelOptions = require('./babel');
const { getPlugins } = require('./plugins');

module.exports = {
  entry: getEntry(true),
  mode: 'production',
  bail: true,
  devtool: false,
  output: {
    path: dist,
    ...outputNames,
    publicPath: '/',
    // Access this library by window[package.name]
    library: 'gif-maker',
    libraryTarget: 'umd',
  },
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin()],
    // Automatically split vendor and commons
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
    // runtimeChunk: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          getImageLoader(true),
          {
            test: /\.jsx?$/,
            sideEffects: false,
            exclude: [/[/\\\\]node_modules[/\\\\]/],
            use: [
              require.resolve('thread-loader'),
              {
                loader: require.resolve('babel-loader'),
                options: getBabelOptions(true),
              },
            ],
          },
          {
            test: /\.css$/,
            use: getStyleLoaders(true, { importLoaders: 1 }),
          },
          {
            test: /\.(scss|sass)$/,
            use: getStyleLoaders(true, { importLoaders: 2 }, 'sass-loader'),
          },
          getFileLoader(true),
        ],
      },
    ],
  },
  plugins: getPlugins(true),
};