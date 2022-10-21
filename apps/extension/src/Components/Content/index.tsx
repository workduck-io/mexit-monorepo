import React, { useEffect, useState } from 'react'

import { createPlateEditor, createPlateUI } from '@udecode/plate'

import { ActionType, defaultContent, ELEMENT_TAG, mog, QuickLinkStatus, QuickLinkType } from '@mexit/core'
import { NodeEditorContent } from '@mexit/core'

import { CopyTag } from '../../Editor/components/Tags/CopyTag'
import getPlugins from '../../Editor/plugins/index'
import { useEditorContext } from '../../Hooks/useEditorContext'
import { useSnippets } from '../../Hooks/useSnippets'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import { useContentStore } from '../../Stores/useContentStore'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import { getDeserializeSelectionToNodes } from '../../Utils/deserialize'
import Results from '../Results'
import { StyledContent } from './styled'

export default function Content() {
  const { activeIndex } = useSputlitContext()
  const results = useSputlitStore((s) => s.results)
  const { setNodeContent, previewMode, persistedContent } = useEditorContext()

  const selection = useSputlitStore((s) => s.selection)
  const { getContent } = useContentStore()
  const getSnippet = useSnippets().getSnippet

  const [deserializedContent, setDeserializedContent] = useState<NodeEditorContent>()

  useEffect(() => {
    if (selection?.range && selection?.url && previewMode) {
      const editor = createPlateEditor({
        plugins: getPlugins(
          createPlateUI({
            [ELEMENT_TAG]: CopyTag as any
          }),
          {
            exclude: { dnd: true }
          }
        )
      })
      const content = getDeserializeSelectionToNodes({ text: selection?.html, metadata: null }, editor, true)

      if (content) setDeserializedContent(content)
    }
  }, [selection])

  useEffect(() => {
    const item = results[activeIndex]
    // const activeItem = useSputlitStore.getState().activeItem

    if (item?.category === QuickLinkType.backlink) {
      const content = getContent(item.id)?.content ?? defaultContent.content
      if (selection?.range && deserializedContent) {
        setNodeContent([...content, { children: deserializedContent, highlight: true }])
      }
      // * We'll enable this later
      else {
        setNodeContent(content)
      }
    } else if (item?.category === QuickLinkType.snippet) {
      const content = getSnippet(item.id).content
      setNodeContent(content)
    }
    // else if (item?.category === QuickLinkType.action && item?.type === ActionType.SCREENSHOT && persistedContent) {
    // const node = useSputlitStore.getState().node
    // const content = getContent(node?.nodeid)?.content ?? defaultContent.content
    // mog('We be setting persistedContent', { content, persistedContent })
    // setNodeContent([...content, { children: persistedContent }])
    // }
  }, [activeIndex, results, deserializedContent, selection, persistedContent])

  return (
    <StyledContent>
      <Results />
    </StyledContent>
  )
}
