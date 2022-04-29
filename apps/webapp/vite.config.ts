import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const sourceMap = process.env.NO_SOURCE_MAP ? false : true

// https://vitejs.dev/config/
export default defineConfig({
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
    dedupe: ['styled-components', 'react', 'react-dom', '@workduck-io/mex-editor', '@udecode/plate']
  },
  plugins: [
    react({
      babel: {
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
    })
  ],
  worker: { format: 'es' }
})
