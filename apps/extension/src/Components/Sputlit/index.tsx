import React from 'react'
import Search from '../Search'
import Content from '../Content'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import { Main, Overlay, Wrapper } from './styled'

const Sputlit = () => {
  const setVisualState = useSputlitContext().setVisualState
  return (
    <div id="sputlit-container">
      <Wrapper>
        <Main>
          <Search />
          <Content />
        </Main>
      </Wrapper>
      <Overlay
        id="sputlit-overlay"
        onClick={() => {
          setVisualState(VisualState.hidden)
        }}
      />
    </div>
  )
}

export default Sputlit
