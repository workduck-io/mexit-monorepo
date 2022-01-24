// Anything here runs in the background

import { getCurrentTab } from './Utils/tabInfo'

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'sputlit' })
  })
})

export {}
