import React, { useEffect, useMemo, useRef } from 'react'

import { AIEvent, useChatStore, useHistoryStore } from '@mexit/core'

import { AssistantResponse } from './AssistantResponse'
import { ConversationWrapper, MessageBubble } from './styled'

const MessageRenderer = ({ nodeId }: { nodeId: string }) => {
  const aiHistory = useHistoryStore((store) => store.ai)
  const clearAIHistory = useHistoryStore((store) => store.clearAIHistory)
  const addChat = useChatStore((store) => store.addChat)
  const getChat = useChatStore((store) => store.getChat)
  const filteredConversation = useRef<AIEvent[]>(null)

  filteredConversation.current = useMemo(() => {
    const previousChats = getChat(nodeId)

    // removing the first message because it's just the context
    const filteredHistory = aiHistory
      .flat()
      .filter((item) => item)
      .slice(1)

    return [...(previousChats || []), ...filteredHistory]
  }, [aiHistory])

  useEffect(() => {
    return () => {
      addChat(nodeId, filteredConversation.current)
      clearAIHistory()
    }
  }, [nodeId])

  return (
    <ConversationWrapper>
      {filteredConversation?.current.map((event, i) => {
        return (
          <>
            {
              {
                ['user']: <MessageBubble role={event.role}> {event.content}</MessageBubble>,
                ['assistant']: <AssistantResponse event={event} />
              }[event.role]
            }
          </>
        )
      })}
    </ConversationWrapper>
  )
}

export { MessageRenderer }
