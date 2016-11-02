// webpack.config.js

const path = require('path')

if(process.env.NODE_ENV === 'development'){
  var loaders = ['babel']
  var plugins = ['react-hot-loader/babel']
} else {
  var loaders = ['babel']
  var plugins = []
}

let node_modules_dir = path.resolve(__dirname, 'node_modules');

module.exports = {
  devtool: 'eval',
  entry: './src/app-client.js',
  output: {
    path: __dirname + '/src/public/dist',
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [ {
        test: /\.js$/,
        loaders: loaders,
        plugins: plugins,
        exclude: [node_modules_dir]
      }, {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0']
        },
        exclude: [node_modules_dir]
      }
    ]
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  }
};
