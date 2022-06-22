import { ActionType, apiURLs } from '@mexit/core'

import { handleCaptureRequest, handleActionRequest, handleAsyncActionRequest } from './Utils/requestHandler'

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
    chrome.tabs.sendMessage(tabs[0].id, { type: 'sputlit' }, (response) => {
      if (!response) {
        chrome.tabs.reload(tabs[0].id)
      }
    })
  })
})

chrome.action.onClicked.addListener((command) => {
  chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'sputlit' }, (response) => {
      if (!response) {
        chrome.tabs.reload(tabs[0].id)
      }
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
    chrome.tabs.sendMessage(tabs[0].id, { type: 'sputlit' }, (response) => {
      if (!response) {
        chrome.tabs.reload(tabs[0].id)
      }
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

chrome.omnibox.onInputEntered.addListener((text) => {
  const url = encodeURI(apiURLs.searchMexit + text)
  chrome.tabs.update({ url: url })
})

export {}
