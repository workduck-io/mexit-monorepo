import React from 'react'

import { AIEventsHistory } from '@mexit/core'

import { AssistantResponse, ConversationWrapper, PairWrapper, UserPrompt } from './styled'

const MessageRenderer = ({ conversationStack }: { conversationStack: AIEventsHistory }) => {
  return (
    <ConversationWrapper>
      {conversationStack?.map((event, i) => {
        const [first, second] = event

        return (
          <PairWrapper>
            {first && <AssistantResponse>{first?.content} </AssistantResponse>}
            {second && <UserPrompt>{second?.content}</UserPrompt>}
          </PairWrapper>
        )
      })}
    </ConversationWrapper>
  )
}

export { MessageRenderer }
