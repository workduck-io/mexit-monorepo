import React, { useEffect, useMemo, useState } from 'react'
import Editor from './Editor'
import styled from 'styled-components'
import { useContentStore } from '../Hooks/useContentStore'
import Search from './Search'
import { useDeserializeSelectionToNodes, getMexHTMLDeserializer } from '../Utils/deserialize'
import HighlightSource from 'web-highlighter/dist/model/source'
import { getPlateSelectors, usePlateEditorRef } from '@udecode/plate'
import { nanoid } from 'nanoid'
import { closeSputlit } from '../contentScript'
import { useAuthStore } from '../Hooks/useAuth'
import { Login, Logout } from './Auth'
import BaseView from './BaseView'

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
  border-top: 1px solid #35373e;
  width: 92%;
  margin-left: auto;
  margin-right: auto;
`

const Sputlit = ({ url, html, range }: { url?: string; html?: string; range?: Partial<HighlightSource> }) => {
  const setContent = useContentStore((store) => store.setContent)
  const nodeId = useMemo(() => nanoid(), [])
  const editor = usePlateEditorRef()
  const [value, setValue] = useState([{ text: '' }])

  useEffect(() => {
    const content = getMexHTMLDeserializer(html, editor)
    if (content !== undefined && content.length > 0 && content[0].text !== '') {
      setContent(url, content, range)
      setValue(content)
    }
  }, [editor])

  const updateContent = (newContent) => {
    // setContent(url, newContent, range)
    return
  }

  return (
    <div id="sputlit-container">
      <Wrapper>
        <Main>
          <Search />
          <Editor nodeId={nodeId} content={value} onChange={updateContent} />
          <BaseView />
          <Footer></Footer>
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
