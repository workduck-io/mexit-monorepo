const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ThreadsPlugin = require('threads-plugin')

module.exports = {
  entry: './src/index.tsx',
  target: 'web',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../..', 'dist', 'apps', 'webapp'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@mexit/shared': path.resolve(__dirname, '../..', 'libs/shared', 'src'),
      '@mexit/core': path.resolve(__dirname, '../..', 'libs/core', 'src')
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify')
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
    })
  ],
  stats: { preset: 'normal', colors: true, errorDetails: true }
}
