import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useContentStore } from '../Hooks/useContentStore'
import styled, { ThemeProvider } from 'styled-components'
import Highlighter from 'web-highlighter'
import { GlobalStyle } from '../Styles/GlobalStyle'
import Sputlit from './Sputlit'
import { theme } from '../Styles/theme'

const Container = styled.div<{ top: number; left: number; showTooltip: boolean }>`
  position: absolute;
  display: ${(props) => (props.showTooltip ? 'flex' : 'none')};
  margin: -3rem 0 0 0;

  background: #fff;
  box-shadow: 0 2px 2px 0 rgb(39 43 49 / 10%);
  padding: 0.25rem;
  border: solid 1px #ccc;
  border-radius: 5px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;

  /* Done because the root is removed before the component is umounted, hence it still stays there */
  &:empty {
    padding: 0;
  }
`

const Div = styled.div`
  cursor: pointer;
  border-radius: 5px;
  padding: 0.3rem;

  img {
    height: 18px;
    aspect-ratio: 1/1;
  }

  &:hover {
    background-color: #eaeaea;
  }
`

function Tooltip({ id, coordinates }: { id: string; coordinates: DOMRect }) {
  const [showTooltip, setShowTooltip] = useState(true)
  const content = useContentStore((store) => store.getContent(window.location.href)).find(
    (item) => item.highlighterId === id
  ).content
  const removeContent = useContentStore((store) => store.removeContent)
  const highligter = new Highlighter()

  const handleDelete = () => {
    highligter.remove(id)
    setShowTooltip(false)
    removeContent(window.location.href, id)
  }

  const handleEdit = () => {
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Sputlit editContent={content} />
      </ThemeProvider>,
      document.getElementById('extension-root')
    )
    setShowTooltip(false)
  }

  useEffect(() => {
    setShowTooltip(true)
  }, [id])

  // TODO: remove this component somehow.
  return (
    <Container
      top={window.scrollY + coordinates.top}
      left={window.scrollX + coordinates.left}
      showTooltip={showTooltip}
    >
      <Div onClick={handleEdit}>
        <img src={chrome.runtime.getURL('/assets/edit.svg')} />
      </Div>

      <Div onClick={handleDelete}>
        <img src={chrome.runtime.getURL('/assets/trash.svg')} />
      </Div>
    </Container>
  )
}

export default Tooltip
