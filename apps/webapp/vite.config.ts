import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    outDir: '../../dist/apps/webapp',
    rollupOptions: {
      input: [
        path.resolve(__dirname, 'src', 'index.tsx'),
        path.resolve(__dirname, 'src', 'Actions/Components', 'AliasWrapper.tsx')
      ],
      output: {
        format: 'es',
        dir: './'
      }
    }
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
