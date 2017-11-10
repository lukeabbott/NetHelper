var debug = process.argv.indexOf('-p') === -1
var path = require('path')

module.exports = {
  context: __dirname,
  devtool: debug ? 'inline-sourcemap' : '',
  entry: ['./main.js'],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          'presets': [['env', {
            targets: {
              browsers: ['last 2 major versions']
            }
          }], 'react']
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'build/src'),
    filename: debug ? 'main.js' : 'main.min.js'
  }
}
