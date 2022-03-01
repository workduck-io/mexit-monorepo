const esbuild = require('esbuild')

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
  .catch(() => process.exit(1))
