import { handleActionRequest, handleStoreRequest, handleAuthRequest } from './Utils/requestHandler'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ACTION_HANDLER') {
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

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'sputlit' })
  })
})

export {}
