import React, { useEffect, useState } from 'react'

import { createPlateEditor, createPlateUI } from '@udecode/plate'

import { defaultContent, ELEMENT_TAG, NodeEditorContent, QuickLinkType } from '@mexit/core'

import { CopyTag } from '../../Editor/components/Tags/CopyTag'
import { generateEditorPluginsWithComponents } from '../../Editor/plugins/index'
import { useEditorStore } from '../../Hooks/useEditorStore'
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
  const { setNodeContent, previewMode } = useEditorStore()

  const selection = useSputlitStore((s) => s.selection)
  const { getContent } = useContentStore()
  const getSnippet = useSnippets().getSnippet

  const [deserializedContent, setDeserializedContent] = useState<NodeEditorContent>()

  useEffect(() => {
    if (selection?.range && selection?.url && previewMode) {
      const editor = createPlateEditor({
        plugins: generateEditorPluginsWithComponents(
          createPlateUI({
            [ELEMENT_TAG]: CopyTag as any
          }),
          {
            exclude: { dnd: true }
          }
        )
      })
      const content = getDeserializeSelectionToNodes({ text: selection?.html, metadata: null }, editor, false)

      // mog('deserializedContent', { content })

      if (content) setDeserializedContent(content)
    }
  }, [selection])

  useEffect(() => {
    const item = results[activeIndex]

    if (item?.category === QuickLinkType.backlink) {
      const content = getContent(item.id)?.content ?? defaultContent.content

      if (selection?.range && deserializedContent) {
        setNodeContent(deserializedContent)
      } else {
        setNodeContent(content)
      }
    } else if (item?.category === QuickLinkType.snippet) {
      const content = getSnippet(item.id).content
      setNodeContent(content)
    }
  }, [activeIndex, results, deserializedContent, selection])

  return (
    <StyledContent>
      <Results />
    </StyledContent>
  )
}
