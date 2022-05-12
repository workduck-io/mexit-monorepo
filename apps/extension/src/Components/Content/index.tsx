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
import { generateNodeId, QuickLinkType } from '@mexit/core'
import { CategoryType, NodeEditorContent, NodeMetadata } from '@mexit/core'
import { useEditorContext } from '../../Hooks/useEditorContext'
import { useSnippets } from '../../Hooks/useSnippets'

export default function Content() {
  const { selection, setVisualState, searchResults, activeIndex } = useSputlitContext()
  const { node, setNodeContent, previewMode } = useEditorContext()

  const setContent = useContentStore((store) => store.setContent)
  const editor = usePlateEditorRef(node.nodeid)
  const [value, setValue] = useState([{ text: '' }])
  const [first, setFirst] = useState(true)
  const userDetails = useAuthStore((state) => state.userDetails)
  const getSnippet = useSnippets().getSnippet

  const ilinks = useDataStore((store) => store.ilinks)
  // Ref so that the function contains the newest value without re-renders
  const currentContent = value
  const contentRef = useRef<NodeEditorContent>(currentContent)

  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)

  useEffect(() => {
    const content = getMexHTMLDeserializer(selection?.html, editor)

    if (selection?.range && content && selection?.url) {
      setNodeContent(content)
      contentRef.current = content
    }
  }, [editor, selection]) // eslint-disable-line

  const handleSave = (payload: any) => {
    const time = Date.now()
    const metadata: NodeMetadata = {
      lastEditedBy: userDetails?.email,
      createdBy: userDetails?.email,
      createdAt: time,
      updatedAt: time,
      saveableRange: selection.range,
      url: window.location.href
    }

    setContent(node.nodeid, contentRef.current, metadata)
    toast.success('Saved')
    console.log('Payload: ', payload)
    const title = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })

    const referenceID = ilinks.filter((ilink) => ilink.path.toLowerCase() === 'drafts')[0]
    chrome.runtime.sendMessage(
      {
        type: 'CAPTURE_HANDLER',
        subType: 'CREATE_CONTENT_QC',
        data: {
          id: generateNodeId(),
          content: contentRef.current,
          referenceID: referenceID,
          title: title,
          workspaceID: workspaceDetails.id,
          createdBy: payload.createdBy
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
          toast.success('Saved')
          setTimeout(() => {
            setVisualState(VisualState.hidden)
          }, 2000)
        }
      }
    )
  }

  useEffect(() => {
    if (searchResults[activeIndex]?.category === QuickLinkType.backlink) {
      const content = useContentStore.getState().getContent(searchResults[activeIndex].id)?.content
      setNodeContent(content)
    } else if (searchResults[activeIndex]?.category === QuickLinkType.snippet) {
      const content = getSnippet(searchResults[activeIndex].id).content
      setNodeContent(content)
    }
  }, [activeIndex, searchResults])

  return (
    <StyledContent>
      <Results />
      {/* TODO: add support for tooltip edit content */}
      <Editor nodeId={node.nodeid} readOnly={previewMode} handleSave={handleSave} />
    </StyledContent>
  )
}
