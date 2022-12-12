import packageJson from './package.json'

const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: 'Mexit',
  version: packageJson.version,
  description: packageJson.description,
  icons: { '16': 'icon16x16.png', '48': 'icon48x48.png', '128': 'icon128x128.png' },
  commands: {
    'open-mexit': {
      suggested_key: { default: 'Ctrl+Shift+X', mac: 'Command+Shift+X' },
      description: 'Open Mexit'
    }
  },
  action: { default_title: 'Click To Open Spotlight' },
  omnibox: { keyword: '[[' },
  background: { service_worker: 'background.js', type: 'module' },
  content_scripts: [{ matches: ['http://*/*', 'https://*/*'], js: ['content.js'], css: ['global.css'] }],
  permissions: ['contextMenus', 'storage', 'tabs', 'activeTab', 'search', 'notifications', 'downloads'],
  web_accessible_resources: [{ resources: ['assets/*', '*.svg'], matches: ['http://*/*', 'https://*/*'] }]
}

export default manifest
