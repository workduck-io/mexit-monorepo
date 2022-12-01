import { messageHandler } from './Sync/messageHandler'

console.log('content script loaded')

/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */
import('./contentScript')
