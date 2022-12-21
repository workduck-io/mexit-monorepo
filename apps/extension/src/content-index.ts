// console.log('content script loaded')

/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */
const currentLocation = window.location.href

if (!currentLocation.startsWith('http://localhost') && !currentLocation.startsWith('https://mexit.workduck.io'))
  import('./contentScript')
