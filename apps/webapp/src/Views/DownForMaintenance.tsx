import React from 'react'

import styled from 'styled-components'
import { createGlobalStyle, css } from 'styled-components'

import { WDLogo } from '@mexit/shared'

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;

  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  background-color: #c287e8;
  color: #0e1428;

  a {
    text-decoration: none;
    color: #ffcc33;
  }

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

export const DownForMaintenance = () => {
  return (
    <StyledApp>
      <LogoWrapper>
        <WDLogo height={'56'} width={'56'} primaryColor={'#1D1A1E'} />
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
