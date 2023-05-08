import React, { useEffect, useMemo } from 'react'

import { deserializeMd, focusEditor, getPlateEditorRef, getPointAfter, insertNodes } from '@udecode/plate'
import Highlighter from 'web-highlighter'

import { IconButton } from '@workduck-io/mex-components'

import { camelCase, generateTempId, SupportedAIEventTypes, useFloatingStore, useHistoryStore } from '@mexit/core'

import { useAIOptions } from '../../Hooks/useAIOptions'
import { StyledButton } from '../../Style/Buttons'
import { Group } from '../../Style/Layouts'
import { AutoComplete } from '../FloatingElements'
import { IconDisplay } from '../IconDisplay'
import { DefaultMIcons } from '../Icons'
import { InsertMenu } from '../InsertMenu'

import AIHistory from './AIHistory'
import AIResponse from './AIResponse'
import { AIContainerFooter, AIContainerHeader, AIContainerSection, StyledAIContainer } from './styled'
import { AIPreviewProps } from './types'

const AIPreviewContainer: React.FC<AIPreviewProps> = (props) => {
  const aiEventsHistory = useHistoryStore((s) => s.ai)
  const activeEventIndex = useHistoryStore((s) => s.activeEventIndex)
  const setActiveEventIndex = useHistoryStore((s) => s.setActiveEventIndex)
  const clearAIResponses = useHistoryStore((s) => s.clearAIResponses)
  const setFloatingElement = useFloatingStore((s) => s.setFloatingElement)

  const { performAIAction } = useAIOptions()

  const defaultItems = useMemo(() => {
    if (props.getDefaultItems) return props.getDefaultItems()
    return []
  }, [])

  const getContent = (content: string) => {
    if (!content) return

    const editor = getPlateEditorRef()
    const deserializedContent = deserializeMd(editor, content)?.map((node) => ({
      ...node,
      id: generateTempId()
    }))

    return deserializedContent
  }

  const insertContent = (content: string, replace = true) => {
    const editor = getPlateEditorRef(props.id)
    const deserializedContent = getContent(content)

    if (Array.isArray(deserializedContent) && deserializedContent.length > 0) {
      const at = replace ? editor?.selection : getPointAfter(editor, editor.selection)

      try {
        insertNodes(editor, deserializedContent, {
          at,
          select: true
        })
        focusEditor(editor, at)
      } catch (err) {
        console.error('Unable to focus editor', err)
      }

      setFloatingElement(undefined)
    }
  }

  useEffect(() => {
    return () => {
      const state = useFloatingStore.getState().state?.AI_POPOVER
      if (state?.id) {
        const highlight = new Highlighter()
        highlight.remove(state.id)
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

  const handleOnInsert = (id?: string) => {
    const content = aiEventsHistory?.at(activeEventIndex)?.at(0)?.content
    if (!props.insertInNote) {
      insertContent(content, false)
    } else {
      const deserializedContent = getContent(content)
      props.onInsert?.(deserializedContent, id)
    }
  }

  const userQuery = aiEventsHistory?.at(activeEventIndex)?.at(-1)
  const defaultValue =
    !userQuery?.type || userQuery?.type === SupportedAIEventTypes.PROMPT
      ? userQuery?.content
      : camelCase(userQuery?.type)

  const disableMenu = useFloatingStore.getState().state?.AI_POPOVER?.disableMenu

  return (
    <StyledAIContainer id="mexit-ai-performer">
      <AIContainerHeader>
        <AutoComplete
          onEnter={handleOnEnter}
          onCommandEnter={handleOnInsert}
          disableMenu={disableMenu}
          clearOnEnter
          defaultValue={defaultValue}
          defaultItems={defaultItems}
        />
      </AIContainerHeader>
      <AIContainerSection>
        <AIResponse plugins={props.plugins} index={activeEventIndex} aiResponse={aiEventsHistory} />
      </AIContainerSection>
      <AIContainerFooter>
        <IconButton title="Clear History" size={12} icon="ri:time-line" onClick={clearAIResponses} />
        <AIHistory onClick={(index: number) => setActiveEventIndex(index)} />
        <Group>
          {props.allowReplace && (
            <StyledButton
              onClick={() => {
                const content = aiEventsHistory?.at(activeEventIndex)?.at(0)?.content
                insertContent(content)
              }}
            >
              <IconDisplay icon={DefaultMIcons.INSERT} size={12} />
              Replace
            </StyledButton>
          )}
          <InsertMenu type="modal" root={props.root} isMenu={props.insertInNote} onClick={handleOnInsert} />
        </Group>
      </AIContainerFooter>
    </StyledAIContainer>
  )
}

export default AIPreviewContainer
