import * as fs from 'fs'
import * as path from 'path'
import { PluginOption } from 'vite'

import colorLog from './log'

const { resolve } = path

const outDir = resolve(__dirname, '..', '../..', 'dist', 'extension')
export default function makeManifest(manifest: chrome.runtime.ManifestV3): PluginOption {
  return {
    name: 'make-manifest',
    buildEnd() {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir)
      }

      const manifestPath = resolve(outDir, 'manifest.json')

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

      colorLog(`Manifest file copy complete: ${manifestPath}`, 'success')
    }
  }
}