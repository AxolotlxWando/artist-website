var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')

var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    main: [path.join(__dirname, 'src')],
    // vendor: ['react', 'react-dom', 'react', 'react-redux', 'react-dnd', 'react-dnd-html5-backend']
  },
  module: {
    loaders: [
      {
        test: /\.js$/, include: path.join(__dirname, 'src'), loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss-loader', 'sass']
      },
      {
        test: /\.css$/, loader: 'style-loader!css-loader'
      },
      {
        test: /(\.md$)|(\.layout$)/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/, loader: 'file?name=[name].[ext]' // url-loader?limit=8192
      }
    ]
  },
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-bundle.js',
    chunkFilename: 'vendor-[chunkhash].js'
  },
  plugins: [
    // See https://github.com/webpack/webpack/tree/master/examples/chunkhash
    // new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor'}),
    new HtmlWebpackPlugin({
      filename: 'index-test.html',
      template: path.join(__dirname, 'src', 'tests', 'index.html'),
      inject: 'body'
    })
  ],
  resolve: {
    root: path.resolve(__dirname, 'src'),
    modulesDirectories: ['node_modules']
  },
  devServer: {
    colors:             true,
    contentBase:        './dist',
    inline:             true,
    progress:           true
  },
  devtool: '#inline-source-map'
}
