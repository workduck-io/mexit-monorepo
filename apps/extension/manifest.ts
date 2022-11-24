import packageJson from './package.json'

const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  options_page: 'src/pages/options/index.html',
  icons: { '16': 'Assets/icon16x16.png', '48': 'Assets/icon48x48.png', '128': 'Assets/icon128x128.png' },
  commands: {
    'open-mexit': {
      suggested_key: { default: 'Ctrl+Shift+X', mac: 'Command+Shift+X' },
      description: 'Open Mexit'
    }
  },
  action: { default_title: 'Click To Open Spotlight' },
  omnibox: { keyword: '[[' },
  background: { service_worker: 'background.js', type: 'module' },
  content_scripts: [{ matches: ['http://*/*', 'https://*/*'], js: ['content.js'], css: ['Assets/global.css'] }],
  externally_connectable: {
    ids: ['*'],
    matches: ['*://localhost:3000/*']
  },
  permissions: ['contextMenus', 'storage', 'tabs', 'activeTab', 'search', 'notifications', 'downloads'],
  web_accessible_resources: [{ resources: ['Assets/*'], matches: ['http://*/*', 'https://*/*'] }]
}

export default manifest
