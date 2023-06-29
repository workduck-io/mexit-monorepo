import { useEffect } from 'react'

import { mog } from '@mexit/core'

import { SocketActionType } from '../Types/Socket'

import { useBroadcastHandler } from './useBroadcastHandler'

const useSocket = () => {
  const { updatesHandler } = useBroadcastHandler()

  const handleAction = (action: SocketActionType, data: any) => {
    switch (action) {
      case SocketActionType.CONTENT_UPDATE: {
        updatesHandler(data)
        break
      }
      default:
        mog('No Handler for this action', { action, data })
    }
  }

  const handleSocketMessage = (message) => {
    if (message) {
      const data = typeof message.data === 'object' ? message.data : JSON.parse(message.data)
      handleAction(data.action, data.data)
    }
  }

  useEffect(() => {
    const broadcastChannel = new BroadcastChannel('WebSocketChannel')

    broadcastChannel.addEventListener('message', (event) => {
      handleSocketMessage(event.data)
    })
  }, [])

  return
}

export default useSocket
