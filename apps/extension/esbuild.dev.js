const esbuild = require('esbuild')
const chokidar = require('chokidar')

;(async () => {
  const builder = await esbuild.build({
    entryPoints: ['./src/background.ts', './src/contentScript.tsx'],
    bundle: true,
    minify: true,
    sourcemap: 'inline',
    target: ['chrome89', 'firefox91'],
    outdir: './public/build',
    define: {
      global: '{}',
      'process.env.NODE_ENV': `"development"`
    },
    incremental: true,
    loader: { '.eot': 'file', '.woff': 'file', '.woff2': 'file', '.ttf': 'file', '.svg': 'file', '.html': 'file' }
  })

  chokidar
    .watch(['src/**/*.{ts,tsx}', 'public/manifest.json'], {
      ignoreInitial: true
    })
    .on('ready', () => {
      console.log(`\x1b[32mDone ⚡️\n\x1b[0m`)
    })
    .on('all', (event, path) => {
      console.log(`Rebuilding: File ${path} triggered Event ${event.toUpperCase()}`)
      builder.rebuild()
      console.log(`\x1b[32mDone ⚡️\n\x1b[0m`)
    })
})()
