import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

const sourceMap = process.env.NO_SOURCE_MAP ? false : true

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['react/jsx-runtime']
  },
  server: {
    port: 3333
  },
  build: {
    sourcemap: sourceMap,
    outDir: '../../dist/apps/webapp'
  },
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      '@mexit/shared': path.resolve(__dirname, '../../libs/shared/src'),
      '@mexit/core': path.resolve(__dirname, '../../libs/core/src')
    },
    dedupe: ['styled-components', 'react', 'react-dom', '@udecode/plate']
  },
  publicDir: './src/Assets/',
  plugins: [
    react({
      babel: {
        compact: true,
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: false
            }
          ]
        ]
      }
    }),
    svgr()
  ],
  worker: { format: 'es' }
})
