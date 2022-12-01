import { BroadcastSyncedChannel, mog } from '@mexit/core'
import { State, StoreApi } from 'zustand'

import { childIframe } from './iframeBroadcast'
import getStore from './storeChannel'

export function share<T extends State, K extends keyof T>(
  key: K,
  api: StoreApi<T>,
  onChangeCallback: (message: MessageType) => void
) {
  let timestamp = 0

  api.subscribe(
    (state) => {
      timestamp = Date.now()
      onChangeCallback({
        msgId: BroadcastSyncedChannel.TEST_BROADCASTING,
        timestamp,
        state
      })
    },
    (state) => state[key]
  )
}

export type MessageType = {
  timestamp: number
  state: any
  msgId: BroadcastSyncedChannel
}

const UnhandledRequestsByExtension = new Set([])

const onStateChange = (message: MessageType) => {
  if (childIframe && !UnhandledRequestsByExtension?.has(message.msgId)) {
    childIframe.broadCastMessage(message.msgId, message)
  }

  UnhandledRequestsByExtension?.delete(message.msgId)
}

// share('userDetails', useAuthStore, onStateChange)

export const messageHandler = (event: MessageType) => {
  UnhandledRequestsByExtension?.add(event.msgId)
  console.log('[Extension]: ', { event })
  const store: StoreApi<any> = getStore(event.msgId)

  if (store) {
    mog('Store', { store, event })
    Object.entries(event.state)?.map(([key, value]: [key: string, value: any]) => {
      store.setState((prev) => ({
        ...prev,
        [key]: value.state
      }))
    })
  }

  UnhandledRequestsByExtension?.delete(event.msgId)
}
