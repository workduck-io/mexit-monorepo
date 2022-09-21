import React from 'react'

import styled from 'styled-components'
import { createGlobalStyle, css } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    display: flex;
    align-items: center;
    height: 100vh;
    width: 100vw;
    margin: 0;
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
    background-color: #C287E8;
    color: #0E1428;
  }
  a {
    text-decoration: none;
    color: #ffcc32;
  }
  #root {
    width: 100%;
    height: 100%;
  }
`

const StyledLogo = styled.svg<{ bubble?: boolean; padding?: string }>`
  padding-right: 8px;
  cursor: pointer;
  ${({ padding }) => css`
    padding: ${padding};
  `}
  -webkit-app-region: no-drag;
  /* cursor: pointer; */
  & path {
    fill: #0e1428;
  }
`

const WDLogo: React.FC<{ height?: string; width?: string; padding?: string }> = ({ height, width, padding }) => {
  const onClick = () => {
    window.location.href = 'https://workduck.io'
  }

  return (
    <StyledLogo
      width={width ?? '25'}
      height={height ?? '25'}
      padding={padding}
      viewBox="0 0 25 25"
      fill="none"
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.46864 6.60626C4.6221 5.89872 3.12692 4.87024 0.998779 1.64887C3.26109 12.5991 6.63926 17.0542 14.1246 20.6711C10.3438 16.0107 8.13675 12.243 7.46864 6.60626Z" />
      <path d="M18.1871 24.5771C12.9258 17.388 9.8833 9.19526 9.8833 0.974876C11.8094 3.83689 13.0892 4.72996 15.6488 5.75698C16.4071 10.267 18.8129 14.4038 21.8865 17.8868C20.7563 20.5327 20.1171 21.5706 18.1871 24.5771Z" />
      <path d="M22.6654 15.8458C24.1976 10.8041 24.7669 6.68091 24.9988 0.577148C23.1378 3.99264 21.621 5.42155 18.9922 6.29282C19.304 9.07383 20.8285 13.6569 22.6654 15.8458Z" />
    </StyledLogo>
  )
}

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

const DownForMaintenance = () => {
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

export default DownForMaintenance
