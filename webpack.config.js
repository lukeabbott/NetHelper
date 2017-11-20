var debug = process.argv.indexOf('-p') === -1
var path = require('path')

module.exports = {
  context: __dirname,
  devtool: debug ? 'inline-sourcemap' : '',
  entry: ['./main.js'],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
            plugins: ['transform-class-properties']
          }
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
