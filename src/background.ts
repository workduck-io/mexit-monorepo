import { handleDwindleRequest } from './Utils/requestHandler'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'DISPATCH_DWINDLE_REQUEST') {
    handleDwindleRequest(request.data).then((resp) => {
      sendResponse(resp)
    })
  }
  return true
})

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'sputlit' })
  })
})

export {}
