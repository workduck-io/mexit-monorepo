import react from '@vitejs/plugin-react'
import fs from 'fs'
import path, { resolve } from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

import addHmr from './build/add-hmr'
import customDynamicImport from './build/custom-dynamic-import'
import makeManifest from './build/make-manifest'
import manifest from './manifest'

const outDir = resolve(__dirname, '../..', 'dist', 'extension')
const coreLibDir = resolve(__dirname, '../..', 'libs/core', 'src')
const sharedLibDir = resolve(__dirname, '../..', 'libs/shared', 'src')
const publicDir = resolve(__dirname, 'src', 'Assets')

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const isDev = process.env.__DEV__ === 'true'
const sourceMap = process.env.NO_SOURCE_MAP ? false : true

// ENABLE HMR IN BACKGROUND SCRIPT
const enableHmrInBackgroundScript = true

const getLastElement = <T>(array: ArrayLike<T>): T => {
  const length = array.length
  const lastIndex = length - 1
  return array[lastIndex]
}

const firstUpperCase = (str: string) => {
  const firstAlphabet = new RegExp(/( |^)[a-z]/, 'g')
  return str.toLowerCase().replace(firstAlphabet, (L) => L.toUpperCase())
}

export default defineConfig({
  optimizeDeps: {
    include: ['reac/jsx-runtime']
  },
  resolve: {
    alias: {
      '@mexit/shared': sharedLibDir,
      '@mexit/core': coreLibDir
    }
  },
  server: {
    port: 6666
  },
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
    makeManifest(manifest),
    customDynamicImport(),
    addHmr({ background: enableHmrInBackgroundScript, view: true }),
    svgr() as any
  ],
  publicDir: publicDir,
  build: {
    minify: !sourceMap,
    outDir: outDir,
    sourcemap: sourceMap,
    rollupOptions: {
      input: {
        content: resolve('src', 'content-index.ts'),
        background: resolve('src', 'background.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: isDev ? 'assets/js/[name].js' : 'assets/js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const { dir, name: _name } = path.parse(assetInfo.name)
          const assetFolder = getLastElement(dir.split('/'))
          const name = assetFolder + firstUpperCase(_name)
          return `assets/[ext]/${name}.chunk.[ext]`
        }
      }
    }
  }
})
