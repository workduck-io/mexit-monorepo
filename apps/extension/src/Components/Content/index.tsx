import { usePlateEditorRef, getPlateEditorRef } from '@udecode/plate'
import { nanoid } from 'nanoid'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { getMexHTMLDeserializer } from '../../Utils/deserialize'
import { Editor } from '../Editor'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import Results from '../Results'
import { StyledContent } from './styled'
import { CategoryType, createNodeWithUid, defaultContent, getNewDraftKey, QuickLinkType } from '@mexit/core'
import { NodeEditorContent } from '@mexit/core'
import { useEditorContext } from '../../Hooks/useEditorContext'
import { useSnippets } from '../../Hooks/useSnippets'
import { useContentStore } from '../../Stores/useContentStore'
import { useSaveChanges } from '../../Hooks/useSaveChanges'

export default function Content() {
  const { selection, searchResults, activeIndex } = useSputlitContext()
  const { node, setNodeContent, previewMode, setNode } = useEditorContext()
  const { saveIt } = useSaveChanges()

  const { getContent } = useContentStore()
  const editor = usePlateEditorRef(node.nodeid)
  const getSnippet = useSnippets().getSnippet

  const deserializedContentRef = useRef<NodeEditorContent>()

  useEffect(() => {
    const content = getMexHTMLDeserializer(selection?.html, editor)

    if (selection?.range && content && selection?.url && previewMode) {
      setNodeContent([{ children: content }])
      deserializedContentRef.current = content
    }
  }, [editor])

  const onChangeSave = (val: any[]) => {
    if (val) {
      setNodeContent(val)
    }
  }

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

    if (item?.category === QuickLinkType.backlink && !item?.extras?.new) {
      const content = getContent(item.id)?.content
      // TODO: fix this
      if (selection?.range) {
        setNodeContent([...content, { text: '\n' }, { children: deserializedContentRef.current }])
      } else {
        setNodeContent(content)
      }
    } else if (item?.category === QuickLinkType.snippet) {
      const content = getSnippet(item.id).content
      setNodeContent(content)
    } else if (!selection) {
      setNodeContent(defaultContent.content)
    }
  }, [activeIndex, searchResults])

  return (
    <StyledContent>
      <Results />
      <Editor readOnly={previewMode} onChange={onChangeSave} />
    </StyledContent>
  )
}
