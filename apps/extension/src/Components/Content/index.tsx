import { usePlateEditorRef } from '@udecode/plate'
import { nanoid } from 'nanoid'
import React, { useEffect, useMemo, useState } from 'react'

import { useContentStore } from '../../Hooks/useContentStore'
import { getMexHTMLDeserializer } from '../../Utils/deserialize'
import { Editor } from '../Editor'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import Results from '../Results'
import Renderer from '../Renderer'
import { StyledContent } from './styled'

export default function Content() {
  const { selection, setVisualState } = useSputlitContext()

  const setContent = useContentStore((store) => store.setContent)
  const nodeId = useMemo(() => `BLOCK_${nanoid()}`, [])
  const editor = usePlateEditorRef(nodeId)
  const [value, setValue] = useState([{ text: '' }])
  const [currentContent, setCurrentContent] = useState(value)
  const [first, setFirst] = useState(true)

  useEffect(() => {
    const content = getMexHTMLDeserializer(selection?.html, editor)

    if (selection?.range && content && selection?.url) {
      setValue(content)
      setCurrentContent(content)
    }
  }, [editor, selection]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateContent = (newContent) => {
    // Because the useEditorChange hook runs the onChange once
    if (!first) {
      setCurrentContent(newContent)
    } else {
      setFirst(true)
    }
    return
  }

  const handleSave = (payload: any) => {
    setContent(selection.url, currentContent, selection.range, nodeId)

    chrome.runtime.sendMessage(
      {
        type: 'CAPTURE_HANDLER',
        subType: 'CREATE_CONTENT_QC',
        data: {
          body: {
            ...payload,
            content: currentContent
          }
        }
      },
      (response) => {
        const { message, error } = response
        if (error) {
          if (error === 'Not Authenticated') {
            console.error('Not Authenticated. Please login via Popup')
          } else {
            console.error('An Error Occured. Please try again')
          }
        } else {
          console.log('Successful')
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
