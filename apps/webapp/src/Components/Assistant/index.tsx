import React, { useState } from 'react'

import arrowLeftSLine from '@iconify/icons-ri/arrow-left-s-line'
import { useTheme } from 'styled-components'

import {
  convertContentToRawText,
  getContent,
  SupportedAIEventTypes,
  useHistoryStore
} from '@mexit/core'
import { AutoComplete, DefaultMIcons, Group, IconDisplay, useAIOptions } from '@mexit/shared'

import { AccordionContent, Chevron, GroupHeader } from '../Views/ViewBlockRenderer/BlockContainer'

import { MessageRenderer } from './MessageRenderer'
import { ConversationContainer } from './styled'

const Assistant = ({ nodeId }: { nodeId: string }) => {
  const [isOpen, setIsOpen] = useState(true)

  const theme = useTheme()
  const { performAIAction } = useAIOptions()
  const aiHistory = useHistoryStore((store) => store.ai)

  const handleOnEnter = async (value: string) => {
    try {
      const content = getContent(nodeId)

      if (aiHistory.length === 0 && content) {
        await performAIAction(SupportedAIEventTypes.PROMPT, convertContentToRawText(content.content), 'system')
      }

      await performAIAction(SupportedAIEventTypes.PROMPT, value)
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
        <MessageRenderer />

        <AutoComplete onEnter={handleOnEnter} clearOnEnter={true} defaultItems={[]} />
      </AccordionContent>
    </ConversationContainer>
  )
}

export { Assistant }
