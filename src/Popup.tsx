import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Login, Logout } from './Components/Auth'
import Init from './Components/Init'
import { useAuthStore } from './Hooks/useAuth'
import { MEXIT_FRONTEND_URL_BASE } from './routes'

const Container = styled.div`
  background-color: #fff;
  width: 480px;
  margin: 1rem;
`

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  border-bottom: 1px solid #ccc;
  padding: 0.5rem 0;
  margin: 0 0 0.5rem 0;

  img {
    width: 20px;
    height: 20px;

    border-radius: 5px;
    padding: 0.3rem;
    &:hover {
      background-color: #eaeaea;
    }
  }
`

const Popup = () => {
  const authenticated = useAuthStore((store) => store.authenticated)

  return (
    <Container>
      <Init />
      <Header>
        <a href="https://workduck.io" target="_blank" rel="noopener noreferrer">
          <img src={chrome.runtime.getURL('/icon128x128.png')} />
        </a>
        <a href={MEXIT_FRONTEND_URL_BASE} target="_blank" rel="noopener noreferrer">
          <img src={chrome.runtime.getURL('/assets/dashboard.svg')} />
        </a>
      </Header>
      {!authenticated ? <Login /> : <Logout />}
    </Container>
  )
}

export default Popup
