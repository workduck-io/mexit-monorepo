import { connectToChild, Methods } from 'penpal'

import { mog } from '@mexit/core'

import { useInitStore } from '../Stores/useInitStore'
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
    }
  }

  const connection = connectToChild({
    iframe,
    methods: exposedMethods
  })

  const handleIframeLoad = async () => {
    console.log({ hello: connection })
    connection.promise
      .then((child) => {
        mog('SETTING IFRAME ADDED')
        childIframe = child
        useInitStore.getState().setIframeAdded(true)
      })
      .catch((err) => {
        console.error('Unable to connect to IFrame')
      })
  }

  iframe.addEventListener('load', handleIframeLoad)

  return () => iframe.removeEventListener('load', handleIframeLoad)
}

export default messageBroadcaster
