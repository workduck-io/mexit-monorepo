import React, { useEffect, useState } from 'react'

import { usePlateEditorRef } from '@udecode/plate'

import { ActionType, defaultContent, QuickLinkType } from '@mexit/core'
import { NodeEditorContent } from '@mexit/core'

import { useEditorContext } from '../../Hooks/useEditorContext'
import { useSaveChanges } from '../../Hooks/useSaveChanges'
import { useSnippets } from '../../Hooks/useSnippets'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import { useContentStore } from '../../Stores/useContentStore'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import { getDeserializeSelectionToNodes } from '../../Utils/deserialize'
import Results from '../Results'
import { StyledContent } from './styled'

export default function Content() {
  const { selection, searchResults, activeIndex } = useSputlitContext()
  const { node, setNodeContent, previewMode, persistedContent } = useEditorContext()
  const { saveIt } = useSaveChanges()

  const { getContent } = useContentStore()
  const editor = usePlateEditorRef(node.nodeid)
  const getSnippet = useSnippets().getSnippet

  const [deserializedContent, setDeserializedContent] = useState<NodeEditorContent>()
  // const { highlighted, clearHighlightedBlockIds } = useBlockHighlightStore()
  // const { focusBlock } = useFocusBlock()

  useEffect(() => {
    const content = getDeserializeSelectionToNodes({ text: selection?.html, metadata: null }, editor, true)
    if (selection?.range && content && selection?.url && previewMode) {
      setDeserializedContent(content)
    }
  }, [editor])

  // useEffect(() => {
  //   const highlights = highlighted.editor
  //   if (!previewMode && highlights.length > 0) {
  //     focusBlock(highlights[highlights.length - 1], node.nodeid)
  //     const clearHighlightTimeout = setTimeout(() => {
  //       clearHighlightedBlockIds('editor')
  //     }, 2000)

  //     return () => clearTimeout(clearHighlightTimeout)
  //   }
  // }, [highlighted, node.nodeid, previewMode])

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
    const activeItem = useSputlitStore.getState().activeItem

    if (item?.category === QuickLinkType.backlink) {
      const content = getContent(item.id)?.content ?? defaultContent.content
      if (selection?.range && deserializedContent) {
        setNodeContent([...content, { children: deserializedContent, highlight: true }])
      } else if (
        (activeItem?.type === ActionType.MAGICAL || activeItem?.type === ActionType.SCREENSHOT) &&
        persistedContent
      ) {
        setNodeContent([...content, { children: persistedContent }])
      } else {
        setNodeContent(content)
      }
    } else if (item?.category === QuickLinkType.snippet) {
      const content = getSnippet(item.id).content
      setNodeContent(content)
    }
  }, [activeIndex, searchResults, deserializedContent, selection, persistedContent])

  return (
    <StyledContent>
      <Results />
      {/* <Editor readOnly={previewMode} onChange={onChangeSave} /> */}
    </StyledContent>
  )
}
