module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return {
        ...webpackConfig,
        devtool: 'inline-source-map',
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
