import React, { useState } from 'react'

import arrowLeftSLine from '@iconify/icons-ri/arrow-left-s-line'
import { getPlateEditorRef } from '@udecode/plate'
import { useTheme } from 'styled-components'

import { SupportedAIEventTypes, useEditorStore, useHistoryStore } from '@mexit/core'
import { AutoComplete, DefaultMIcons, Group, IconDisplay, useAIOptions } from '@mexit/shared'

import { AccordionContent, Chevron, GroupHeader } from '../Views/ViewBlockRenderer/BlockContainer'

import { MessageRenderer } from './MessageRenderer'
import { ConversationContainer } from './styled'

const Assistant = () => {
  const [isOpen, setIsOpen] = useState(true)
  const theme = useTheme()
  const node = useEditorStore((state) => state.node)
  const { performAIAction } = useAIOptions()
  const aiHistory = useHistoryStore((store) => store.ai)
  const editor = getPlateEditorRef()

  // const nodeContent = parseToMarkdown({ children: editor.getFragment(), type: ELEMENT_PARAGRAPH })?.trim()

  const handleOnEnter = async (value: string) => {
    try {
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
        <MessageRenderer conversationStack={aiHistory} />

        <AutoComplete onEnter={handleOnEnter} clearOnEnter={true} defaultItems={[]} />
      </AccordionContent>
    </ConversationContainer>
  )
}

export { Assistant }
