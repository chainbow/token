const path = require('path')

module.exports = {
  devtool: '#source-map',
  entry: {
    admin: './app/src/admin.js'
  },
  output: {
    path: path.resolve(__dirname, './build/js'),
    publicPath: '/js/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {}
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!sass-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.js'
    }
  }
}
