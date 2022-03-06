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
  const [currentContent, setCurrentContent] = useState()
  const nodeId = useMemo(() => `BLOCK_${nanoid()}`, [])
  const editor = usePlateEditorRef(nodeId)
  const [value, setValue] = useState([{ text: '' }])

  useEffect(() => {
    const content = getMexHTMLDeserializer(selection?.sanitizedHTML, editor)

    if (selection?.range && content && selection?.url) {
      setValue(content)
    }
  }, [editor, selection]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateContent = (newContent) => {
    setCurrentContent(newContent)
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
      {selection && <Editor nodeUID={nodeId} content={value} onChange={updateContent} handleSave={handleSave} />}
    </StyledContent>
  )
}
