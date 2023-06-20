import React, { useState } from 'react'

import arrowLeftSLine from '@iconify/icons-ri/arrow-left-s-line'
import { useTheme } from 'styled-components'

import { AIEvent, convertContentToRawText, getContent, SupportedAIEventTypes, useHistoryStore } from '@mexit/core'
import { AutoComplete, DefaultMIcons, Group, IconDisplay, useAIOptions } from '@mexit/shared'

import { AccordionContent, Chevron, GroupHeader } from '../Views/ViewBlockRenderer/BlockContainer'

import { MessageRenderer } from './MessageRenderer'
import { ConversationContainer } from './styled'

const Assistant = ({ nodeId }: { nodeId: string }) => {
  const [isOpen, setIsOpen] = useState(true)

  const theme = useTheme()
  const { performAIAction, aiRequestHandler } = useAIOptions()
  const aiHistory = useHistoryStore((store) => store.ai)
  const addInitialEvent = useHistoryStore((store) => store.addInitialEvent)
  const addInAIHistory = useHistoryStore((store) => store.addInAIHistory)

  const handleOnEnter = async (value: string) => {
    try {
      const contentText = convertContentToRawText(getContent(nodeId)?.content)

      if (aiHistory.length === 0 && contentText !== '') {
        const queries: AIEvent[] = [
          { content: contentText, role: 'system' },
          { content: value, role: 'user', type: SupportedAIEventTypes.PROMPT }
        ]

        await aiRequestHandler({ context: queries }, (res) => {
          if (res?.content) {
            addInitialEvent(queries[0])
            addInAIHistory(queries[1], res)
          }
        })
      } else {
        await performAIAction(SupportedAIEventTypes.PROMPT, value)
      }
    } catch (err) {
      console.error('Unable generate prompt result', err)
    }
  }

  const handleToggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  return (
    <ConversationContainer>
      <GroupHeader padding isOpen={!!isOpen} onClick={handleToggleAccordion}>
        <Group>
          <IconDisplay icon={DefaultMIcons.AI} color={theme.tokens.colors.primary.hover} />
          <span>AI Assistant</span>
        </Group>
        <Chevron isOpen={isOpen} onClick={handleToggleAccordion} height={24} width={24} icon={arrowLeftSLine} />
      </GroupHeader>

      <AccordionContent isOpen={isOpen}>
        <MessageRenderer nodeId={nodeId} />

        <AutoComplete onEnter={handleOnEnter} clearOnEnter={true} defaultItems={[]} />
      </AccordionContent>
    </ConversationContainer>
  )
}

export { Assistant }
