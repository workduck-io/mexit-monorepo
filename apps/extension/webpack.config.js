// const nrwlConfig = require('@nrwl/react/plugins/webpack.js') // require the main @nrwl/react/plugins/webpack configuration function.
const { ESBuildMinifyPlugin } = require('esbuild-loader')

const devtool = process.env.NO_SOURCE_MAP ? false : 'inline-source-map'

module.exports = (config, context) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    loader: 'esbuild-loader',
    options: {
      loader: 'tsx',
      target: 'es2021'
    }
  })

  config.module.rules.push({
    test: /\.svg$/,
    oneOf: [
      {
        issuer: /\.(js|ts|md)x?$/,
        use: [
          {
            loader: require.resolve('@svgr/webpack'),
            options: {
              svgo: false,
              titleProp: true,
              ref: true
            }
          },
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: '[name].[hash:7].[ext]',
              esModule: false
            }
          }
        ]
      },
      // Fallback to plain URL loader.
      {
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: '[name].[hash:7].[ext]'
            }
          }
        ]
      }
    ]
  })

  // then override your config.
  return {
    ...config,
    stats: { preset: 'normal', colors: true },
    devtool: devtool,
    entry: {
      content: './src/contentScript.tsx',
      background: './src/background.ts'
    },
    output: {
      ...config.output,
      filename: '[name].js'
    },
    optimization: {
      minimize: !!process.env.NO_SOURCE_MAP,
      minimizer: [new ESBuildMinifyPlugin()],
      runtimeChunk: false
    },
    node: { global: true } // Fix: "Uncaught ReferenceError: global is not defined", and "Can't resolve 'fs'".
  }
}
