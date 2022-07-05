import { usePlateEditorRef, getPlateEditorRef } from '@udecode/plate'
import { nanoid } from 'nanoid'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { getDeserializeSelectionToNodes, getMexHTMLDeserializer } from '../../Utils/deserialize'
import { Editor } from '../Editor'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import Results from '../Results'
import { StyledContent } from './styled'
import { CategoryType, createNodeWithUid, defaultContent, getNewDraftKey, ILink, mog, QuickLinkType } from '@mexit/core'
import { NodeEditorContent } from '@mexit/core'
import { useEditorContext } from '../../Hooks/useEditorContext'
import { useSnippets } from '../../Hooks/useSnippets'
import { useContentStore } from '../../Stores/useContentStore'
import { useSaveChanges } from '../../Hooks/useSaveChanges'
import { useBlockHighlightStore, useFocusBlock } from '../../Stores/useFocusBlock'

export default function Content() {
  const { selection, searchResults, activeIndex } = useSputlitContext()
  const { node, setNodeContent, previewMode, setNode, nodeContent } = useEditorContext()
  const { saveIt } = useSaveChanges()

  const { getContent } = useContentStore()
  const editor = usePlateEditorRef(node.nodeid)
  const getSnippet = useSnippets().getSnippet

  const [deserializedContent, setDeserializedContent] = useState<NodeEditorContent>()
  const { highlighted, clearHighlightedBlockIds } = useBlockHighlightStore()
  const { focusBlock } = useFocusBlock()

  useEffect(() => {
    const content = getDeserializeSelectionToNodes({ text: selection?.html, metadata: null }, editor, true)

    // mog('deserialized content', { content })

    if (selection?.range && content && selection?.url && previewMode) {
      // setNodeContent([...activeNodeContent, { text: '\n' }, { children: deserializedContent }])
      setDeserializedContent(content)
    }
  }, [editor])

  const onChangeSave = (val: any[]) => {
    if (val) {
      // setNodeContent(val)
    }
  }

  useEffect(() => {
    const highlights = highlighted.editor
    if (!previewMode && highlights.length > 0) {
      focusBlock(highlights[highlights.length - 1], node.nodeid)
      const clearHighlightTimeout = setTimeout(() => {
        clearHighlightedBlockIds('editor')
      }, 2000)

      return () => clearTimeout(clearHighlightTimeout)
    }
  }, [highlighted, node.nodeid, previewMode])

  useEffect(() => {
    const handleSaveKeydown = (event: KeyboardEvent) => {
      if (event.key === 's' && event.metaKey && !previewMode) {
        event.preventDefault()
        saveIt(true, true)
      }
    }

    document.getElementById('mexit')!.addEventListener('keydown', handleSaveKeydown)

    return () => {
      document.getElementById('mexit')!.removeEventListener('keydown', handleSaveKeydown)
    }
  }, [node, previewMode])

  useEffect(() => {
    const item = searchResults[activeIndex]
    if (item?.category === QuickLinkType.backlink) {
      const content = getContent(item.id)?.content ?? defaultContent.content
      if (selection?.range && deserializedContent) {
        setNodeContent([...content, { children: deserializedContent, highlight: true }])
      } else {
        setNodeContent(content)
      }
    } else if (item?.category === QuickLinkType.snippet) {
      const content = getSnippet(item.id).content
      setNodeContent(content)
    }
  }, [activeIndex, searchResults, deserializedContent, selection])

  return (
    <StyledContent>
      <Results />
      <Editor readOnly={previewMode} onChange={onChangeSave} />
    </StyledContent>
  )
}
