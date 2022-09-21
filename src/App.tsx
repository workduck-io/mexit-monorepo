import React from 'react'
import styled from 'styled-components'
import GlobalStyle from './Styles/GlobalStyle'

const Container = styled.div`
  display: flex;
  flex-direction: row;
`

const App = () => {
  return (
    <React.Fragment>
      <GlobalStyle />
      <Container>
        <h1>Shhh....Going for a short nap to duck better. We can keep this a secret, right?</h1>
        <img src="/duck-with-knife.png" />
      </Container>
      <h2>Till then, you can get to know us here</h2>
    </React.Fragment>
  )
}

export default App
