import { useEffect } from 'react'

import { mog, SocketActionType, SocketMessage } from '@mexit/core'

import { useMessagesStore } from '../Stores/useMessageStore'

import { useBroadcastHandler } from './useBroadcastHandler'

const useSocket = () => {
  const { updatesHandler } = useBroadcastHandler()
  const messages = useMessagesStore((store) => store.messages)
  const removeMessage = useMessagesStore((store) => store.removeMessage)

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
    messages.forEach((message) => {
      handleSocketMessage(message)

      removeMessage(message.id)
    })
  }, [messages])

  return
}

export default useSocket
