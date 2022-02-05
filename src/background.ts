import { apiURLs } from './routes'
import * as Sentry from '@sentry/browser'
import { CaptureConsole } from '@sentry/integrations'
import mixpanel from 'mixpanel-browser'

import { handleActionRequest, handleAuthRequest, handleStoreRequest } from './Utils/requestHandler'

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    const url = apiURLs.mexitHome
    chrome.tabs.create(
      {
        url: url,
        pinned: true
      },
      (tab) => {
        tab.highlighted = true
        tab.active = true
      }
    )
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ACTION_HANDLER') {
    if (process.env.REACT_APP_MIXPANEL_TOKEN) {
      console.log('Tried to Send Event?')
      mixpanel.track('Action Handler Event', {
        type: 'ACTION_HANDLER',
        subType: request?.type?.subType
      })
      console.log('Tracked Event in Mixpanel')
    }
    const res = handleActionRequest(request)
    sendResponse(res)
    return true
  } else if (request.type === 'AUTH_HANDLER') {
    const res = handleAuthRequest(request)
    sendResponse(res)
    return true
  } else if (request.type === 'STORE_HANDLER') {
    const res = handleStoreRequest(request)
    sendResponse(res)
    return true
  }
})

chrome.runtime.onMessage.addListener((message, sender) => {
  if (!message.request.action_name) return

  switch (message.request.action_name) {
    case 'reload':
      chrome.tabs.reload()
      break
    case 'remove-local-storage':
      chrome.browsingData.removeLocalStorage({ since: 0 })
      break
    case 'browser-search':
      chrome.search.query(
        {
          disposition: 'NEW_TAB',
          text: message.request.query
        },
        () => {} // eslint-disable-line @typescript-eslint/no-empty-function
      )
      break
    case 'chrome-url':
      chrome.tabs.create({ url: message.request.base_url })
      break
    case 'remove-cookies':
      chrome.browsingData.removeCookies({ since: 0 })
      break
    case 'remove-history':
      chrome.browsingData.removeHistory({ since: 0 })
      break
    case 'remove-cache':
      chrome.browsingData.removeCache({ since: 0 })
      break
  }
})

if (process.env.REACT_APP_MIXPANEL_TOKEN) mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, { debug: true })

Sentry.init({
  dsn: 'https://0c6a334e733d44da96cfd64cc23b1c85@o1127358.ingest.sentry.io/6169172',
  integrations: [new CaptureConsole({ levels: ['error'] })]
})

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'sputlit' })
  })
})

export {}
