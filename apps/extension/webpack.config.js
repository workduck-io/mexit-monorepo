const nrwlConfig = require('@nrwl/react/plugins/webpack.js') // require the main @nrwl/react/plugins/webpack configuration function.
// const devtool = process.env.NO_INLINE_SOURCE_MAP ? 'source-map' : 'inline-source-map'

module.exports = (config, context) => {
  nrwlConfig(config) // first call it so that it @nrwl/react plugin adds its configs,

  // then override your config.
  return {
    ...config,
    module: {
      rules: [
        // Use esbuild as a Babel alternative
        {
          test: /\.tsx?$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2015'
          }
        }
      ]
    },
    devtool: 'inline-source-map',
    entry: {
      content: './src/contentScript.tsx',
      background: './src/background.ts'
    },
    output: {
      ...config.output,
      filename: '[name].js'
    },
    optimization: {
      ...config.optimization,
      runtimeChunk: false
    },
    node: { global: true } // Fix: "Uncaught ReferenceError: global is not defined", and "Can't resolve 'fs'".
  }
}
