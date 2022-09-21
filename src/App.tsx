import React from 'react'
import styled from 'styled-components'
import GlobalStyle from './Styles/GlobalStyle'
import WDLogo from './Logo'

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 100%;
  padding: 1rem;

  @media (max-width: 600px) {
    justify-content: space-around;
  }
`

const StyledFooter = styled.div`
  font-weight: 400;
`

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column-reverse;

    img {
      width: 100%;
      padding: 1rem;
    }
  }
`

const LogoWrapper = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;

  display: flex;
  justify-content: flex-start;
  padding: 0.5rem;
  transition: padding 0.5s ease;

  @media (max-width: 600px) {
    top: 0.5rem;
    left: 0.5rem;
  }
`

const App = () => {
  return (
    <StyledApp>
      <GlobalStyle />
      <LogoWrapper>
        <WDLogo height={'56'} width={'56'} />
      </LogoWrapper>

      <Container>
        <div>
          <h1>Shhh....Going for a short nap to duck better.</h1>
          <h1>We can keep this a secret, right?</h1>
        </div>
        <img src="/duck-with-knife.png" />
      </Container>
      <StyledFooter>
        <h2>
          Till then, you can get to know us{' '}
          <a href="https://workduck.io" rel="noopener noreferrer">
            here
          </a>
        </h2>
      </StyledFooter>
    </StyledApp>
  )
}

export default App
