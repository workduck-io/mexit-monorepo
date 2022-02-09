const devtool = process.env.NO_INLINE_SOURCE_MAP ? 'source-map' : 'inline-source-map'

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return {
        ...webpackConfig,
        devtool: devtool,
        entry: {
          main: [
            env === 'development' && require.resolve('react-dev-utils/webpackHotDevClient'),
            paths.appIndexJs
          ].filter(Boolean),
          content: './src/contentScript.tsx',
          background: './src/background.ts'
        },
        output: {
          ...webpackConfig.output,
          filename: '[name].js'
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false
        }
      }
    }
  }
}
