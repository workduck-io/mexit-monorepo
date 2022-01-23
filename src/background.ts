// Anything here runs in the background

import { getCurrentTab } from './Utils/tabInfo'

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'sputlit' })
  })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.request) {
    case 'close-sputlit':
      getCurrentTab().then((response) => {
        chrome.tabs.sendMessage(response.id, { type: 'close-sputlit' })
      })
  }
})

export {}
