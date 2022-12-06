import { connectToChild, Methods } from 'penpal'

import { styleSlot } from '../Utils/cs-utils'

import { messageHandler, MessageType } from './messageHandler'

export let childIframe = undefined

const appendChild = (child) => {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    styleSlot.appendChild(child)
  } else {
    console.log('[DOCUMENT]: Loading Content...')
    document.addEventListener('DOMContentLoaded', () => {
      styleSlot.appendChild(child)
    })
  }
}

const messageBroadcaster = () => {
  const iframe = document.createElement('iframe')
  iframe.src = 'http://localhost:3333/iframe.html'
  iframe.id = 'mexit-extension-iframe'

  appendChild(iframe)

  const exposedMethods: Methods = {
    sendToExtension: (message: MessageType) => {
      messageHandler(message)
      return 100
    }
  }

  const connection = connectToChild({
    iframe,
    methods: exposedMethods
  })

  const handleIframeLoad = async () => {
    connection.promise.then((child) => {
      childIframe = child
    })
  }

  iframe.addEventListener('load', handleIframeLoad)

  return () => iframe.removeEventListener('load', handleIframeLoad)
}

export default messageBroadcaster
