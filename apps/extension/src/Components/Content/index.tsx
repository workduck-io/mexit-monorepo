import { usePlateEditorRef } from '@udecode/plate'
import { nanoid } from 'nanoid'
import React, { useEffect, useMemo, useState } from 'react'
import { ActionType, NodeEditorContent } from '@mexit/shared'
import styled from 'styled-components'
import HighlightSource from 'web-highlighter/dist/model/source'

import { useContentStore } from '../../Hooks/useContentStore'
import { getMexHTMLDeserializer } from '../../Utils/deserialize'
import { Editor } from '../Editor'
import Search from '../Search'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import Results from '../Results'
import Renderer from '../Renderer'
import { StyledContent } from './styled'

export default function Content({
  url,
  html,
  range,
  editContent
}: {
  url?: string
  html?: string
  range?: Partial<HighlightSource>
  editContent?: NodeEditorContent
}) {
  const { search, setSearch, searchResults, activeItem, setActiveItem, activeIndex, setActiveIndex, setVisualState } =
    useSputlitContext()

  const setContent = useContentStore((store) => store.setContent)
  const [currentContent, setCurrentContent] = useState()
  const nodeId = useMemo(() => `BLOCK_${nanoid()}`, [])
  const editor = usePlateEditorRef(nodeId)
  const [value, setValue] = useState([{ text: '' }])

  const content = getMexHTMLDeserializer(html, editor)

  useEffect(() => {
    console.log(`content: ${JSON.stringify(content)}`)
    if (range && content && url) {
      setValue(content)
    }
  }, [editor]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateContent = (newContent) => {
    setCurrentContent(newContent)
    return
  }

  const handleSave = (payload: any) => {
    setContent(url, currentContent, range, nodeId)

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
      <Editor
        nodeUID={nodeId}
        content={editContent ? editContent : value}
        onChange={updateContent}
        handleSave={handleSave}
      />
    </StyledContent>
  )
}
