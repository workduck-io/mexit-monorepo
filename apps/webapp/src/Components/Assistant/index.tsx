import React, { useEffect } from 'react'

import { getPlateEditorRef } from '@udecode/plate'

import { SupportedAIEventTypes, useEditorStore, useHistoryStore } from '@mexit/core'
import { AutoComplete, useAIOptions } from '@mexit/shared'

import { MessageRenderer } from './MessageRenderer'

const Assistant = () => {
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

  useEffect(() => {
    console.log(aiHistory)
  }, [aiHistory])

  return (
    // Chat Wrapper
    <div>
      <MessageRenderer conversationStack={aiHistory} />

      <div>
        <AutoComplete onEnter={handleOnEnter} clearOnEnter={true} defaultItems={[]} />
      </div>
    </div>
  )
}

export { Assistant }
