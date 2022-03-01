const esbuild = require('esbuild')

esbuild
  .build({
    entryPoints: ['./src/background.ts', './src/contentScript.tsx'],
    bundle: true,
    minify: true,
    sourcemap: process.env.NODE_ENV !== 'production',
    target: ['chrome89', 'firefox91'],
    outdir: './public/build',
    define: {
      global: '{}',
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
    },
    assetNames: './src/Assets'
  })
  .catch(() => process.exit(1))
