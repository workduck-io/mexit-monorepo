import { usePlateEditorRef } from '@udecode/plate'
import { nanoid } from 'nanoid'
import React, { useEffect, useMemo, useState } from 'react'
import { NodeEditorContent } from '@mexit/shared'
import styled from 'styled-components'
import HighlightSource from 'web-highlighter/dist/model/source'

import { closeSputlit } from '@mexit/shared'
import { useContentStore } from '../Hooks/useContentStore'
import { getMexHTMLDeserializer } from '../Utils/deserialize'
import { Editor } from './Editor'
import Search from './Search'

const Overlay = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 9999;
  opacity: 0.6;
  transition: all 0.1s cubic-bezier(0.05, 0.03, 0.35, 1);
`

const Wrapper = styled.div`
  position: fixed;
  width: 700px;
  border-radius: 8px;

  margin: auto;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 9999999999;
  height: 540px;
  transition: all 0.2s cubic-bezier(0.05, 0.03, 0.35, 1);
`

const Main = styled.div`
  position: absolute;
  width: 100%;
  background: rgb(252, 252, 252);
  box-shadow: 0px 6px 20px rgb(0 0 0 / 20%);

  border-radius: 5px;
  top: 0px;
  left: 0px;
  z-index: 9999999998;
  height: fit-content;
  transition: all 0.2s cubic-bezier(0.05, 0.03, 0.35, 1);
  display: block;
`

const Sputlit = ({
  url,
  html,
  range,
  editContent
}: {
  url?: string
  html?: string
  range?: Partial<HighlightSource>
  editContent?: NodeEditorContent
}) => {
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
            closeSputlit()
          }, 2000)
        }
      }
    )
  }

  return (
    <div id="sputlit-container">
      <Wrapper>
        <Main>
          {/* TODO: This is fucked up, Fix */}
          {html === undefined && editContent === undefined ? (
            <Search />
          ) : (
            <Editor
              nodeUID={nodeId}
              content={editContent ? editContent : value}
              onChange={updateContent}
              handleSave={handleSave}
            />
          )}
        </Main>
      </Wrapper>
      <Overlay
        id="sputlit-overlay"
        onClick={() => {
          closeSputlit()
        }}
      />
    </div>
  )
}

export default Sputlit
