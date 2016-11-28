// webpack.config.js

const path = require('path')
const webpack = require('webpack')

var envPlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
})

if(process.env.NODE_ENV === 'production'){
  var plugins = [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js','common.js'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: true },
      comments: false,
      sourceMap: false,
      mangle: true,
      minimize: true
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fr/),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    envPlugin
  ]

  var devtool='cheap-module-source-map'

} else {
  var plugins = ['react-hot-loader/babel',envPlugin],
    devtool = 'eval'
}



let node_modules_dir = path.resolve(__dirname, 'node_modules');

module.exports = {
  devtool: devtool,
  entry: './src/app-client.js',
  output: {
    path: __dirname + '/src/public/dist',
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [ {
        test: /\.js$/,
        loaders: ['babel'],
        plugins: plugins,
        exclude: [node_modules_dir]
      },{
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        plugins: plugins,
        query: {
          presets: ['es2015', 'react', 'stage-0']
        },
        exclude: [node_modules_dir]
      },{
        test: /\.css$/,
        loader: 'style!css?modules',
        include: /flexboxgrid/,
      }
    ]
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  }
};
