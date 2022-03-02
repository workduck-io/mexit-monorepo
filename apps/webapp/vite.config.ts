import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const sourceMap = process.env.NO_SOURCE_MAP ? false : true

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: sourceMap,
    outDir: '../../dist/apps/webapp'
  },
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      '@mexit/shared': path.resolve(__dirname, '../../libs/shared/src')
    },
    dedupe: ['styled-components', 'react', 'react-dom', '@workduck-io/mex-editor', '@udecode/plate']
  },
  plugins: [react()]
})
