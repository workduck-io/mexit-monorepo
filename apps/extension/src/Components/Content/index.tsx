import { usePlateEditorRef } from '@udecode/plate'
import { nanoid } from 'nanoid'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { useContentStore } from '../../Hooks/useContentStore'
import { getMexHTMLDeserializer } from '../../Utils/deserialize'
import { Editor } from '../Editor'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import Results from '../Results'
import Renderer from '../Renderer'
import { StyledContent } from './styled'
import { useAuthStore } from '../../Hooks/useAuth'
import toast from 'react-hot-toast'

export default function Content() {
  const { selection, setVisualState } = useSputlitContext()

  const setContent = useContentStore((store) => store.setContent)
  const nodeId = useMemo(() => `BLOCK_${nanoid()}`, [])
  const editor = usePlateEditorRef(nodeId)
  const [value, setValue] = useState([{ text: '' }])
  const [first, setFirst] = useState(true)

  // Ref so that the function contains the newest value without re-renders
  const currentContent = value
  const contentRef = useRef(currentContent)

  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)

  useEffect(() => {
    const content = getMexHTMLDeserializer(selection?.html, editor)

    if (selection?.range && content && selection?.url) {
      setValue(content)
      contentRef.current = content
    }
  }, [editor, selection]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateContent = (newContent) => {
    // Because the useEditorChange hook runs the onChange once
    if (!first) {
      contentRef.current = newContent
    } else {
      setFirst(true)
    }
    return
  }

  const handleSave = (payload: any) => {
    setContent(selection.url, contentRef.current, selection.range, nodeId)
    toast.success('Saved')

    chrome.runtime.sendMessage(
      {
        type: 'CAPTURE_HANDLER',
        subType: 'CREATE_CONTENT_QC',
        data: {
          body: {
            ...payload,
            content: contentRef.current,
            workspaceID: workspaceDetails.id
          }
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

  return (
    <StyledContent>
      <Results />
      {/* TODO: add support for tooltip edit content */}
      {selection && (
        <Editor
          nodeUID={nodeId}
          content={selection?.editContent ? selection?.editContent : value}
          onChange={updateContent}
          handleSave={handleSave}
        />
      )}
    </StyledContent>
  )
}
