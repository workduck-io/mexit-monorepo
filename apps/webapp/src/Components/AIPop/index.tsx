import React, { useEffect, useMemo } from 'react'

import {
  deserializeMd,
  focusEditor,
  getEndPoint,
  getPlateEditorRef,
  insertNodes,
  usePlateEditorRef
} from '@udecode/plate'
import Highlighter from 'web-highlighter'

import { IconButton } from '@workduck-io/mex-components'

import { camelCase, generateTempId, SupportedAIEventTypes, useFloatingStore, useHistoryStore } from '@mexit/core'
import { AutoComplete, DefaultMIcons, Group } from '@mexit/shared'

import { useAIOptions } from '../../Hooks/useAIOptions'
import { useCreateNewMenu } from '../../Hooks/useCreateNewMenu'
import Plateless from '../Editor/Plateless'

import AIHistory from './AIHistory'
import {
  AIContainerFooter,
  AIContainerHeader,
  AIContainerSection,
  AIResponseContainer,
  StyledAIContainer
} from './styled'

const AIResponse = ({ aiResponse, index }) => {
  const editor = usePlateEditorRef()
  const selected = aiResponse?.at(index)?.at(0)

  if (selected) {
    const deserialize = deserializeMd(editor, selected?.content)

    return (
      <AIResponseContainer>
        <Plateless key={`wd-mexit-ai-response-${index}`} content={deserialize} multiline />
      </AIResponseContainer>
    )
  }

  return <></>
}

interface AIPreviewProps {
  onInsert?: (content: string) => void
}

const AIBlockPopover: React.FC<AIPreviewProps> = (props) => {
  const aiEventsHistory = useHistoryStore((s) => s.ai)
  const activeEventIndex = useHistoryStore((s) => s.activeEventIndex)
  const setActiveEventIndex = useHistoryStore((s) => s.setActiveEventIndex)
  const clearAIResponses = useHistoryStore((s) => s.clearAIResponses)
  const setFloatingElement = useFloatingStore((s) => s.setFloatingElement)

  const { performAIAction } = useAIOptions()
  const { getAIMenuItems } = useCreateNewMenu()

  const defaultItems = useMemo(() => {
    return getAIMenuItems()
  }, [])

  const insertContent = (content: string, replace = true) => {
    if (!content) return

    const editor = getPlateEditorRef()
    const deserialize = deserializeMd(editor, content)?.map((node) => ({
      ...node,
      id: generateTempId()
    }))

    if (Array.isArray(deserialize) && deserialize.length > 0) {
      const at = replace ? editor.selection : getEndPoint(editor, editor.selection)

      insertNodes(editor, deserialize, {
        at,
        select: true
      })

      try {
        focusEditor(editor)
      } catch (err) {
        console.error('Unable to focus editor', err)
      }

      setFloatingElement(undefined)
    }
  }

  useEffect(() => {
    return () => {
      const state = useFloatingStore.getState().state?.AI_POPOVER
      if (state?.range) {
        const highlight = new Highlighter()
        highlight.removeAll()
      }
    }
  }, [])

  const handleOnEnter = async (value: string) => {
    try {
      await performAIAction(SupportedAIEventTypes.PROMPT, value)
    } catch (err) {
      console.error('Unable generate prompt result', err)
    }
  }

  const userQuery = aiEventsHistory?.at(activeEventIndex)?.at(-1)
  const defaultValue =
    !userQuery?.type || userQuery?.type === SupportedAIEventTypes.PROMPT
      ? userQuery?.content
      : camelCase(userQuery?.type)

  const disableMenu = useFloatingStore.getState().state?.AI_POPOVER?.disableMenu

  return (
    <StyledAIContainer>
      <AIContainerHeader>
        <AutoComplete
          onEnter={handleOnEnter}
          disableMenu={disableMenu}
          clearOnEnter
          defaultValue={defaultValue}
          defaultItems={defaultItems}
        />
      </AIContainerHeader>
      <AIContainerSection>
        <AIResponse index={activeEventIndex} aiResponse={aiEventsHistory} />
      </AIContainerSection>
      <AIContainerFooter>
        <IconButton title="Clear History" size={12} icon="ri:time-line" onClick={clearAIResponses} />
        <AIHistory onClick={(index: number) => setActiveEventIndex(index)} />
        <Group>
          <IconButton
            title="Replace"
            onClick={() => {
              const content = aiEventsHistory?.at(activeEventIndex)?.at(0)?.content
              insertContent(content)
            }}
            size={12}
            icon={DefaultMIcons.INSERT.value}
          />
          <IconButton
            title="Insert"
            size={12}
            icon={DefaultMIcons.EMBED.value}
            onClick={() => {
              const content = aiEventsHistory?.at(activeEventIndex)?.at(0)?.content
              insertContent(content, false)
            }}
          />
        </Group>
      </AIContainerFooter>
    </StyledAIContainer>
  )
}

export default AIBlockPopover
