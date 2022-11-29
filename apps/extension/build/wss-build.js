import { build } from 'esbuild'

const promises = [
  build({
    entryPoints: ['build/reload/initReloadServer.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: 'build/reload/initReloadServer.js',
    external: ['*.node', 'ws', 'chokidar', 'timers']
  })
    .then(() => {
      console.log('\x1b[34m', 'build/reload/initReloadServer.ts -> build/reload/initReloadServer.js', '\x1b[0m')
    })
    .catch(() => {
      console.log('\x1b[31m', 'Error occurred when building build/reload/initReloadServer.ts', '\x1b[0m')
    }),
  build({
    entryPoints: ['build/reload/injections/script.ts'],
    bundle: true,
    platform: 'browser',
    format: 'esm',
    outfile: 'build/reload/injections/script.js'
  })
    .then(() => {
      console.log('\x1b[34m', 'build/reload/injections/script.ts -> build/reload/injections/script.js', '\x1b[0m')
    })
    .catch(() => {
      console.log('\x1b[31m', 'Error occurred when building build/reload/injections/script.ts', '\x1b[0m')
    }),
  build({
    entryPoints: ['build/reload/injections/view.ts'],
    bundle: true,
    platform: 'browser',
    format: 'esm',
    outfile: 'build/reload/injections/view.js'
  })
    .then(() => {
      console.log('\x1b[34m', 'build/reload/injections/view.ts -> build/reload/injections/view.js', '\x1b[0m')
    })
    .catch(() => {
      console.log('\x1b[31m', 'Error occurred when building build/reload/injections/view.ts', '\x1b[0m')
    })
]

Promise.all(promises)
  .then(() => {
    console.log('\x1b[32m', 'Reload Dependencies built successfully!', '\x1b[0m')
  })
  .catch(() => {
    console.log('\x1b[31m', 'An Error Occurred trying to build dependencies for reload')
  })
