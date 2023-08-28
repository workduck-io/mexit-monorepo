import { StoreApi } from 'zustand'

import { BroadcastSyncedChannel, mog } from '@mexit/core'

import getStore from './storeChannel'

export type MessageType = {
  updatedAt: number
  state: any
  msgId: BroadcastSyncedChannel
  fromLocal?: boolean
}

export const UnhandledRequestsByExtension = new Set([])

export const messageHandler = (event: MessageType) => {
  UnhandledRequestsByExtension?.add(event.msgId)
  const store: StoreApi<any> = getStore(event.msgId)

  mog(`IFRAME: ${event.msgId}`, { event })

  if (store) {
    if (event.fromLocal) {
      store.setState(event.state)
    } else {
      Object.entries(event.state)?.map(([key, value]: [key: string, value: any]) => {
        mog(key, { value })
        store.setState((prev) => ({
          ...prev,
          [key]: value.state
        }))
      })
    }
  }

  UnhandledRequestsByExtension?.delete(event.msgId)
}
