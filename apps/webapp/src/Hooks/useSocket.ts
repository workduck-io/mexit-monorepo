import { useEffect } from 'react'

import { BroadcastChannel, createLeaderElection } from 'broadcast-channel'

import { mog } from '@mexit/core'

import { SocketActionType, SocketMessage } from '../Types/Socket'

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

  const handleSocketMessage = (message: SocketMessage) => {
    handleAction(message.action, message.data)
  }

  useEffect(() => {
    const broadcastChannel = new BroadcastChannel('WebSocketChannel')
    const elector = createLeaderElection(broadcastChannel)

    elector.awaitLeadership().then(() => {
      mog('this tab is the leader')
    })

    elector.broadcastChannel.addEventListener('message', handleSocketMessage)

    return () => {
      elector.broadcastChannel.removeEventListener('message', handleSocketMessage)
    }
  }, [])

  return
}

export default useSocket
