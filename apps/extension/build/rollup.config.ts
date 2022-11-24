import typescript from '@rollup/plugin-typescript'

const plugins = [typescript()]

export default [
  {
    plugins,
    input: 'build/reload/initReloadServer.ts',
    output: {
      file: 'build/reload/initReloadServer.js'
    },
    external: ['ws', 'chokidar', 'timers']
  },
  {
    plugins,
    input: 'build/reload/injections/script.ts',
    output: {
      file: 'build/reload/injections/script.js'
    }
  },
  {
    plugins,
    input: 'build/reload/injections/view.ts',
    output: {
      file: 'build/reload/injections/view.js'
    }
  }
]
