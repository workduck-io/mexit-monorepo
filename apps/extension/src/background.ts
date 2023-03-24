// eslint-disable-next-line
import reloadOnUpdate from 'virtual:reload-on-update-in-background-script'

import { ActionType, API_BASE_URLS, fuzzySearch, useAuthStore, useLinkStore } from '@mexit/core'
import * as Sentry from '@sentry/browser'
import { CaptureConsole } from '@sentry/integrations'

import {
  handleActionRequest,
  handleAsyncActionRequest,
  handleCaptureRequest,
  handleHighlightRequest,
  handleNodeContentRequest,
  handleSharingRequest,
  handleShortenerRequest,
  handleSnippetRequest
} from './Utils/requestHandler'

reloadOnUpdate('src')

Sentry.init({
  dsn: 'https://0c6a334e733d44da96cfd64cc23b1c85@o1127358.ingest.sentry.io/6169172',
  integrations: [new CaptureConsole({ levels: ['error'] })]
})

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create(
      {
        url: API_BASE_URLS.frontend,
        pinned: true
      },
      (tab) => {
        tab.highlighted = true
        tab.active = true
      }
    )
  }

  // * On update, show release notes
  // else if (details.reason === 'update') {
  //   // * TODO: Use release notes url
  //   const url = 'http://localhost:3333/share/namespace/id'
  //   chrome.tabs.create(
  //     {
  //       url,
  //       pinned: false
  //     },
  //     (tab) => {
  //       tab.active = true
  //     }
  //   )
  // }
})

const handleResponseCallback = (tabId: number, response: any) => {
  if (!response) {
    // * Don't reload the webpage if there's no response
    // chrome.tabs.reload(tabs[0].id)
    return
  }
}

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id

    chrome.tabs.sendMessage(tabId, { type: 'sputlit' }, (response) => {
      handleResponseCallback(tabId, response)
    })
  })
})

chrome.action.onClicked.addListener((command) => {
  chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id

    chrome.tabs.sendMessage(tabId, { type: 'sputlit' }, (response) => {
      handleResponseCallback(tabId, response)
    })
  })
})

chrome.contextMenus.create({
  id: 'open-sputlit',
  title: 'Open Sputlit',
  contexts: ['page', 'selection']
})

chrome.contextMenus.onClicked.addListener((onClickData) => {
  chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id

    chrome.tabs.sendMessage(tabId, { type: 'sputlit' }, (response) => {
      handleResponseCallback(tabId, response)
    })
  })
})

const notificationButtons = [{ title: 'Snooze' }, { title: 'Dismiss' }]

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const actionType = request.type

  switch (actionType) {
    case 'CAPTURE_HANDLER': {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(async () => {
        const res = await handleCaptureRequest(request)
        console.log('Got response: ', res)
        sendResponse(res)
      })()
      return true
    }

    case 'NODE_CONTENT': {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(async () => {
        const res = await handleNodeContentRequest(request)
        console.log('Got response: ', res)
        sendResponse(res)
      })()
      return true
    }

    case 'NEW_SNIPPET': {
      ;(async () => {
        const res = await handleSnippetRequest(request)
        sendResponse(res)
      })()
      return true
    }

    case 'DOWNLOAD_AVATAR': {
      chrome.downloads.download({
        url: request.data.url,
        filename: 'avatar.svg'
      })
      return true
    }

    case 'PUBLIC_SHARING': {
      ;(async () => {
        const res = await handleSharingRequest(request)
        console.log('PUBLIC_SHARING_RESPONSE', res)
        sendResponse(res)
      })()
      return true
    }

    case 'SHORTENER': {
      ;(async () => {
        const res = await handleShortenerRequest(request)
        console.log('SHORTENER_RESPONSE', res)
        sendResponse(res)
      })()
      return true
    }

    case 'HIGHLIGHT': {
      ;(async () => {
        const res = await handleHighlightRequest(request)
        console.log('HIGHLIGHT_RESPONSE', res)
        sendResponse(res)
      })()
      return true
    }

    case ActionType.BROWSER_EVENT: {
      handleActionRequest(request)
      return true
    }

    case 'ASYNC_ACTION_HANDLER': {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(async () => {
        const res = await handleAsyncActionRequest(request)
        sendResponse(res)
      })()
      return true
    }

    case 'SHOW_REMINDER': {
      console.log('reminderGroups', request.attachment)
      // TODO: add support for more notifications at a time
      const firstReminder = request.attachment[0]?.reminders[0]

      chrome.notifications.create(firstReminder.id, {
        message: firstReminder.description,
        title: firstReminder.title,
        type: 'basic',
        iconUrl: './Assets/icon48x48.png',
        priority: 2,
        requireInteraction: true,
        buttons: notificationButtons
      })

      return true
    }

    default: {
      return true
    }
  }
})

chrome.notifications.onClicked.addListener((notificationId) => {
  console.log('Clicked on ', notificationId)

  chrome.tabs?.query({ active: true }, (tabs) => {
    console.log('tabs', tabs)
    chrome.tabs.sendMessage(tabs[0].id, { type: 'RAJU', action: 'OPEN', notificationId })
  })

  chrome.notifications.clear(notificationId)
})

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  console.log(`Clicked on ${notificationButtons[buttonIndex].title} for notification ${notificationId}`)

  chrome.tabs?.query({ active: true }, (tabs) => {
    console.log('tabs', tabs)
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'RAJU',
      action: `${notificationButtons[buttonIndex].title.toUpperCase()}`,
      notificationId
    })
  })

  chrome.notifications.clear(notificationId)
})

chrome.notifications.onClosed.addListener((notificationId, byUser) => {
  console.log(`clearing ${notificationId}`)

  chrome.tabs?.query({ active: true }, (tabs) => {
    console.log('tabs', tabs)
    chrome.tabs.sendMessage(tabs[0].id, { type: 'RAJU', action: 'DISMISS', notificationId })
  })

  chrome.notifications.clear(notificationId)
})

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const workspaceDetails = useAuthStore.getState().workspaceDetails
  const linkCaptures = useLinkStore.getState().links?.filter((item) => item.alias) ?? []

  const suggestions = fuzzySearch(linkCaptures, text, (item) => item.alias).map((item) => {
    return {
      content: `${API_BASE_URLS.url}/${workspaceDetails.id}/${item.alias}`,
      description: `${item.alias}${item.title ? ` - ${item.title}` : ''}`
    }
  })

  suggest(suggestions)
})

chrome.omnibox.onInputEntered.addListener((text) => {
  chrome.tabs.update({ url: text })
})

export {}
