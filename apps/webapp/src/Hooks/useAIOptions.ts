import { deserializeMd, getPlateEditorRef } from '@udecode/plate'

import { API, ELEMENT_PARAGRAPH, mog, NodeEditorContent } from '@mexit/core'

import parseToMarkdown from '../Editor/utils'

export const useAIOptions = () => {
  const summarize = async (): Promise<NodeEditorContent | undefined> => {
    const editor = getPlateEditorRef()

    if (!editor.selection) return

    const nodeFragments = editor.getFragment()
    const selectedText = parseToMarkdown({ children: nodeFragments, type: ELEMENT_PARAGRAPH })?.trim()

    try {
      const summary = await API.ai.perform('summarize', {
        context: selectedText,
        type: 'markdown'
      })

      const summaryInPlateFormat = deserializeMd(editor, summary)

      return summaryInPlateFormat

      mog('Selected text', { selectedText, nodeFragments })
    } catch (err) {
      mog('SummarizationError', { err })
    }
  }

  return {
    summarize
  }
}
