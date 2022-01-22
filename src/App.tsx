import React from 'react'
import styled, { keyframes } from 'styled-components'

import Init from './Components/Init'
import { Login, Logout } from './Components/Auth'
import { useAuthStore } from './Hooks/useAuth'
import BaseView from './Components/BaseView'

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

function App() {
  const authenticated = useAuthStore((store) => store.authenticated)

  return (
    <Container>
      <Init />
      <Header>
        <Logo src="/logo.svg" alt="logo" />
        {!authenticated ? (
          <Login />
        ) : (
          <>
            <BaseView />
            <Logout />
          </>
        )}
      </Header>
    </Container>
  )
}

export default App
