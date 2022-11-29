import { build } from 'esbuild'

const promises = [
  build({
    entryPoints: ['build/hmr/initReloadServer.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: 'build/hmr/initReloadServer.js',
    external: ['*.node', 'ws', 'chokidar', 'timers']
  })
    .then(() => {
      console.log('\x1b[34m', 'build/hmr/initReloadServer.ts -> build/hmr/initReloadServer.js', '\x1b[0m')
    })
    .catch(() => {
      console.log('\x1b[31m', 'Error occurred when building build/hmr/initReloadServer.ts', '\x1b[0m')
    }),
  build({
    entryPoints: ['build/hmr/injections/script.ts'],
    bundle: true,
    platform: 'browser',
    format: 'esm',
    outfile: 'build/hmr/injections/script.js'
  })
    .then(() => {
      console.log('\x1b[34m', 'build/hmr/injections/script.ts -> build/hmr/injections/script.js', '\x1b[0m')
    })
    .catch(() => {
      console.log('\x1b[31m', 'Error occurred when building build/hmr/injections/script.ts', '\x1b[0m')
    }),
  build({
    entryPoints: ['build/hmr/injections/view.ts'],
    bundle: true,
    platform: 'browser',
    format: 'esm',
    outfile: 'build/hmr/injections/view.js'
  })
    .then(() => {
      console.log('\x1b[34m', 'build/hmr/injections/view.ts -> build/hmr/injections/view.js', '\x1b[0m')
    })
    .catch(() => {
      console.log('\x1b[31m', 'Error occurred when building build/hmr/injections/view.ts', '\x1b[0m')
    })
]

Promise.all(promises)
  .then(() => {
    console.log('\x1b[32m', 'HMR Dependencies built successfully!', '\x1b[0m')
  })
  .catch(() => {
    console.log('\x1b[31m', 'An Error Occurred trying to build dependencies for reload')
  })
