import { connectToChild, Methods } from 'penpal'

import { API_BASE_URLS } from '@mexit/core'

import { useInitStore } from '../Stores/useInitStore'
import { getElementById, styleSlot } from '../Utils/cs-utils'

import { messageHandler, MessageType } from './messageHandler'

export let childIframe = undefined
export let root = undefined

const appendChild = (child) => {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    styleSlot.appendChild(child)
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      styleSlot.appendChild(child)
      root = getElementById('ext-side-nav')
    })
  }
}

const messageBroadcaster = () => {
  const iframe = document.createElement('iframe')
  iframe.src = `${API_BASE_URLS.frontend}/iframe.html`
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
