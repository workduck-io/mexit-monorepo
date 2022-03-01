const esbuild = require('esbuild')
const fs = require('fs')

esbuild
  .build({
    entryPoints: ['./src/background.ts', './src/contentScript.tsx'],
    bundle: true,
    minify: true,
    sourcemap: false,
    target: ['chrome89', 'firefox91'],
    outdir: './public/build',
    define: {
      global: '{}',
      'process.env.NODE_ENV': `"production"`
    },
    loader: { '.eot': 'file', '.woff': 'file', '.woff2': 'file', '.ttf': 'file', '.svg': 'file', '.html': 'file' }
  })
  .then(() => {
    fs.cpSync('./public', '../../dist/apps/extension', { recursive: true })
    console.log(`\x1b[32mDone ⚡️\n\x1b[0m`)
  })
  .catch(() => process.exit(1))
