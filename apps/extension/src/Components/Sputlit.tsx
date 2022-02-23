import { usePlateEditorRef } from '@udecode/plate'
import { nanoid } from 'nanoid'
import React, { useEffect, useMemo, useState } from 'react'
import { NodeEditorContent } from '@mexit/shared'
import styled from 'styled-components'
import HighlightSource from 'web-highlighter/dist/model/source'

import { closeSputlit } from '@mexit/shared'
import { useContentStore } from '../Hooks/useContentStore'
import { getMexHTMLDeserializer } from '../Utils/deserialize'
import Editor from './Editor'
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

const Footer = styled.div`
  height: 45px;
  line-height: 45px;
  border-top: 0.5px solid #ccc;
  margin-left: auto;
  margin-right: auto;
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
  const nodeId = useMemo(() => `BLOCK_${nanoid()}`, [])
  const editor = usePlateEditorRef(nodeId)
  const [value, setValue] = useState([{ text: '' }])
  const content = getMexHTMLDeserializer(html, editor)

  useEffect(() => {
    if (range && content && url) {
      setContent(url, content, range, nodeId)
      setValue(content)
    }
  }, [editor]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateContent = (newContent) => {
    // setContent(url, newContent, range)
    return
  }

  console.log(`html: ${!!html} \n editContent: ${!!editContent} ${editContent}`)
  return (
    <div id="sputlit-container">
      <Wrapper>
        <Main>
          {/* TODO: This is fucked up, Fix */}
          {html === undefined && editContent === undefined ? (
            <Search />
          ) : (
            <Editor nodeId={nodeId} content={editContent ? editContent : value} onChange={updateContent} />
          )}
          {/* <Footer id="sputlit-footer">Omni puts number of results and stuff here, lets see what we do</Footer> */}
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
