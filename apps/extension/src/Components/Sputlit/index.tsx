import React from 'react'
import Search from '../Search'
import Content from '../Content'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import { Main, Overlay, SputlitContainer, Wrapper } from './styled'

const Sputlit = () => {
  const setVisualState = useSputlitContext().setVisualState

  return (
    <SputlitContainer id="sputlit-container">
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
    </SputlitContainer>
  )
}

export default Sputlit
