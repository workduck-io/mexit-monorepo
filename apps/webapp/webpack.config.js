/* 

Webpack, you old friend
Thank you for the trouble,
Will see you soon sometime,
for now let this saga end
*/

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ThreadsPlugin = require('threads-plugin')
const webpack = require('webpack')

module.exports = {
  entry: './src/index.tsx',
  target: 'web',
  mode: 'development',
  devServer: {
    port: 3333
  },
  output: {
    path: path.resolve(__dirname, '../..', 'dist', 'apps', 'webapp'),
    filename: 'index.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@mexit/shared': path.resolve(__dirname, '../..', 'libs/shared', 'src'),
      '@mexit/core': path.resolve(__dirname, '../..', 'libs/core', 'src')
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      process: 'process/browser'
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules|\.d\.ts$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            noEmit: false
          }
        }
      },
      {
        test: /\.d\.ts$/,
        loader: 'ignore-loader'
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      }
    ]
  },
  plugins: [
    new ThreadsPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html')
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ],
  stats: { preset: 'normal', colors: true, errorDetails: true }
}
