import React, { useMemo } from 'react'

import { useHistoryStore } from '@mexit/core'

import { AssistantResponse } from './AssistantResponse'
import { ConversationWrapper, MessageBubble } from './styled'

const MessageRenderer = () => {
  const aiHistory = useHistoryStore((store) => store.ai)

  const filteredConversation = useMemo(() => {
    // removing the first two messages because it's just a reply to the context
    return aiHistory
      .flat()
      .filter((item) => item)
      .slice(2)
  }, [aiHistory])

  return (
    <ConversationWrapper>
      {filteredConversation?.map((event, i) => {
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
