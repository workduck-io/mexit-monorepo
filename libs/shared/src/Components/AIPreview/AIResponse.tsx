import React, { useEffect, useState } from 'react'

import { createPlateEditor, deserializeMd, Plate, usePlateEditorRef } from '@udecode/plate'
import { useDebouncedCallback } from 'use-debounce'

import { ELEMENT_PARAGRAPH, NodeEditorContent, useHistoryStore } from '@mexit/core'

import { EditorStyles } from '../../Style/Editor'
import { getDeserializeSelectionToNodes } from '../../Utils/deserialize'
import { parseToMarkdown } from '../../Utils/utils'

import { AIResponseContainer } from './styled'

const AIResponse = ({ aiResponse, index, plugins }) => {
  const editor = usePlateEditorRef()
  const [mounted, setMounted] = useState(false)
  const selected = aiResponse?.at(index)?.at(0)
  const updateAIEvent = useHistoryStore((s) => s.updateAIEvent)

  useEffect(() => {
    if (selected?.inputFormat === 'html') {
      const baseEditor = createPlateEditor({ plugins })

      const content = getDeserializeSelectionToNodes(
        {
          text: selected.content,
          metadata: ''
        },
        baseEditor
      )
      onChange(content)
      setMounted(true)
    }
  }, [])

  const onChange = useDebouncedCallback((value: NodeEditorContent) => {
    if (selected && value) {
      const markdownContent = parseToMarkdown({ children: value, type: ELEMENT_PARAGRAPH })

      updateAIEvent(
        {
          ...selected,
          inputFormat: 'markdown',
          content: markdownContent
        },
        index
      )
    }
  }, 400)

  if (selected && selected.inputFormat !== 'html') {
    const deserialize = deserializeMd(editor, selected?.content)

    return (
      <AIResponseContainer>
        <EditorStyles>
          <Plate
            value={deserialize}
            plugins={plugins}
            onChange={(e) => onChange(e)}
            id={`wd-mexit-ai-response-${aiResponse.length}-${index}-${mounted}`}
          />
        </EditorStyles>
      </AIResponseContainer>
    )
  }

  return <></>
}

export default AIResponse
