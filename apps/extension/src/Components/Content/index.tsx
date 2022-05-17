import { usePlateEditorRef } from '@udecode/plate'
import { nanoid } from 'nanoid'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { useContentStore } from '../../Hooks/useContentStore'
import { getMexHTMLDeserializer } from '../../Utils/deserialize'
import { Editor } from '../Editor'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import Results from '../Results'
import { StyledContent } from './styled'
import { useAuthStore } from '../../Hooks/useAuth'
import toast from 'react-hot-toast'
import useDataStore from '../../Stores/useDataStore'
import {
  CaptureType,
  createNodeWithUid,
  defaultContent,
  extractMetadata,
  generateNodeId,
  getNewDraftKey,
  QuickLinkType
} from '@mexit/core'
import { CategoryType, NodeEditorContent, NodeMetadata } from '@mexit/core'
import { useEditorContext } from '../../Hooks/useEditorContext'
import { useSnippets } from '../../Hooks/useSnippets'
import tinykeys from 'tinykeys'

export default function Content() {
  const { selection, setVisualState, searchResults, activeIndex } = useSputlitContext()
  const { node, nodeContent, setNodeContent, previewMode, setNode } = useEditorContext()

  const { setContent, setMetadata, getContent } = useContentStore()
  const editor = usePlateEditorRef(node.nodeid)
  const userDetails = useAuthStore((state) => state.userDetails)
  const getSnippet = useSnippets().getSnippet

  const ilinks = useDataStore((store) => store.ilinks)
  // Ref so that the function contains the newest value without re-renders
  const currentContent = nodeContent
  const contentRef = useRef<NodeEditorContent>(currentContent)

  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)

  useEffect(() => {
    const content = getMexHTMLDeserializer(selection?.html, editor)

    if (selection?.range && content && selection?.url) {
      setNodeContent(content)
      contentRef.current = content
    }
  }, [editor, selection]) // eslint-disable-line

  // useEffect(() => {
  //   console.log('NODE CHANGED: ', node)
  // }, [node])

  const onChangeSave = (val: any[]) => {
    if (val) {
      setNodeContent(val)
      contentRef.current = val
    }
  }

  useEffect(() => {
    const handleSave = () => {
      const metadata = {
        saveableRange: selection?.range,
        sourceUrl: selection?.range && window.location.href
      }

      console.log(node.nodeid, contentRef.current)
      setContent(node.nodeid, contentRef.current)

      toast.success('Saved')

      chrome.runtime.sendMessage(
        {
          type: 'CAPTURE_HANDLER',
          subType: 'CREATE_CONTENT_QC',
          data: {
            id: node.nodeid,
            content: contentRef.current,
            title: node.title,
            nodePath: { path: node.path },
            type: CaptureType.DRAFT,
            workspaceID: workspaceDetails.id,
            metadata: metadata
          }
        },
        (response) => {
          const { message, error } = response
          if (error) {
            if (error === 'Not Authenticated') {
              toast.error('Not Authenticated. Please login on Mexit webapp.')
            } else {
              toast.error('An Error Occured. Please try again.')
            }
          } else {
            setMetadata(message.node.id, extractMetadata(message.node))
            toast.success('Saved to Cloud')
            setTimeout(() => {
              setVisualState(VisualState.hidden)
            }, 2000)
          }
        }
      )
    }

    const handleSaveKeydown = (event: KeyboardEvent) => {
      if (event.key === 's' && event.metaKey) {
        event.preventDefault()
        handleSave()
      } else if (event.key === 'Enter' && event.metaKey) {
        event.preventDefault()
        handleSave()
      }
    }

    document.getElementById('mexit')!.addEventListener('keydown', handleSaveKeydown)

    return () => {
      // handleSave()
      document.getElementById('mexit')!.removeEventListener('keydown', handleSaveKeydown)
    }
  }, [node])

  useEffect(() => {
    const item = searchResults[activeIndex]

    if (item?.category === QuickLinkType.backlink && !item?.extras?.new) {
      const content = getContent(item.id)?.content
      setNodeContent(content)
    } else if (item?.category === QuickLinkType.snippet) {
      const content = getSnippet(item.id).content
      setNodeContent(content)
    } else {
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
