import { useEffect } from 'react'
import useWebSocket from 'react-use-websocket'

import { useAuthStore as useDwindleStore } from '@workduck-io/dwindle'

import { config, mog, useAuthStore } from '@mexit/core'

import { SocketActionType } from '../Types/Socket'

import { useBroadcastHandler } from './useBroadcastHandler'

const useSocket = () => {
  const userId = useAuthStore((s) => s.userDetails?.id)
  const idToken = useDwindleStore((s) => s.userCred?.token)
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

  const utilFunctions = useWebSocket(
    config.baseURLs.MEXIT_WEBSOCKET_URL,
    {
      onOpen: () => mog('CONNECTION OPENED'),
      retryOnError: false,
      onError: (event) => {
        mog('Socket Error Occured', { event })
      },
      onMessage: handleSocketMessage,
      queryParams: { userId, Authorizer: idToken },
      share: true
    },
    false // !!(idToken && userId)
  )

  return utilFunctions
}

export default useSocket
