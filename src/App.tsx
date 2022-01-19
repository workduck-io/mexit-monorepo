import React, { useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useAuth } from '@workduck-io/dwindle'

import Auth, { Login } from './Components/Auth'
import config from './config'
import { useAuthStore } from './Hooks/useAuth'

const Container = styled.div`
  text-align: center;
`

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Logo = styled.img`
  height: 40vmin;
  pointer-events: none;
  @media (prefers-reduced-motion: no-preference) {
    animation: ${spin} infinite 20s linear;
  }
`

const Header = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`

export const Init = () => {
  const { initCognito } = useAuth()

  useEffect(() => {
    console.log('Setting Up Authentication')
    const userAuthenticatedEmail = initCognito({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    })

    console.log('User Authenticated Email: ', userAuthenticatedEmail)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

function App() {
  return (
    <Container>
      <Init />
      <Header>
        <Logo src="/logo.svg" alt="logo" />
        <p>Hello, World!</p>
        <Auth />
      </Header>
    </Container>
  )
}

export default App
