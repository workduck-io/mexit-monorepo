import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, PluginOption } from 'vite'
import svgr from 'vite-plugin-svgr'

const sourceMap = process.env.NO_SOURCE_MAP ? false : true
const isDev = process.env.MODE === 'development' ? true : false

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['react/jsx-runtime', '@workduck-io/flexsearch', 'threads/worker'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  server: {
    port: 3333
  },
  build: {
    sourcemap: sourceMap,
    outDir: '../../dist/webapp',
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        iframe: path.resolve(__dirname, 'iframe.html')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: isDev ? 'assets/js/[name].js' : 'assets/js/[name].[hash].js'
      }
    }
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
    }) as PluginOption,
    svgr()
  ],
  worker: { format: 'es' }
})
