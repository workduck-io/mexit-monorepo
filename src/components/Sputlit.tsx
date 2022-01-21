import React, { useEffect } from 'react'
import Editor from './Editor'
import styled from 'styled-components'
import { useContentStore } from '../Hooks/useContentStore'
import Search from './Search'
import { useDeserializeSelectionToNodes } from '../Utils/deserialize'
import HighlightSource from 'web-highlighter/dist/model/source'

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

function Sputlit({
  url,
  html,
  nodeId,
  range
}: {
  url: string
  html: string
  nodeId: string
  range: Partial<HighlightSource>
}) {
  const setContent = useContentStore((store) => store.setContent)
  const content = useDeserializeSelectionToNodes(nodeId, { text: html }) || [{ text: '' }]

  setContent(url, content, range)

  return (
    <div>
      <Wrapper>
        <Main>
          {/* TODO: don't render editor if nothing selected, opposite with search results */}
          <Search />
          <Editor nodeId={nodeId} content={content} />

          <Footer>
            {/* <div id="omni-results">2 results</div>
            <div id="omni-arrows">
              Use arrow keys <span className="omni-shortcut">↑</span>
              <span className="omni-shortcut">↓</span> to navigate
            </div> */}
          </Footer>
        </Main>
      </Wrapper>
      <Overlay />
    </div>
  )
}

export default Sputlit
