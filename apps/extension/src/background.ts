import { apiURLs } from '@mexit/shared'
import * as Sentry from '@sentry/browser'
import { CaptureConsole } from '@sentry/integrations'
import mixpanel from 'mixpanel-browser'

import {
  handleCaptureRequest,
  handleActionRequest,
  handleAsyncActionRequest,
  handleAuthRequest,
  handleStoreRequest
} from './Utils/requestHandler'

// if (process.env.REACT_APP_MIXPANEL_TOKEN) mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, { debug: true })

Sentry.init({
  dsn: 'https://0c6a334e733d44da96cfd64cc23b1c85@o1127358.ingest.sentry.io/6169172',
  integrations: [new CaptureConsole({ levels: ['error'] })]
})

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

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'sputlit' })
  })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const actionType = request.type

  switch (actionType) {
    case 'CAPTURE_HANDLER': {
      // if (process.env.REACT_APP_MIXPANEL_TOKEN) {
      //   console.log('Tried to Send Event?')
      //   mixpanel.track('Action Handler Event', {
      //     type: 'CAPTURE_HANDLER',
      //     subType: request?.type?.subType
      //   })
      //   console.log('Tracked Event in Mixpanel')
      // }

      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(async () => {
        const res = await handleCaptureRequest(request)
        console.log('Got response: ', res)
        sendResponse(res)
      })()
      return true
    }

    case 'BROWSER_EVENT': {
      handleActionRequest(request)
      return true
    }

    case 'ASYNC_ACTION_HANDLER': {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(async () => {
        const res = await handleAsyncActionRequest(request)
        console.log('Got async action response: ', res)
        sendResponse(res)
      })()
      return true
    }

    case 'AUTH_HANDLER': {
      const res = handleAuthRequest(request)
      sendResponse(res)
      return true
    }

    case 'STORE_HANDLER': {
      const res = handleStoreRequest(request)
      sendResponse(res)
      return true
    }

    default: {
      return true
    }
  }
})

chrome.omnibox.onInputEntered.addListener((text) => {
  const url = encodeURI(apiURLs.searchMexit + text)
  chrome.tabs.update({ url: url })
})

export {}
