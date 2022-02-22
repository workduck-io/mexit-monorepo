import React from 'react'
import { useAuthStore } from '../Hooks/useAuth'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;

  width: 0;
  margin: 0 0.25rem;
`

const StyledChotu = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0.25rem;

  color: #fff;
  border-radius: 25px;
  border: 2px solid rgba(255, 255, 255, 1);
  transition-property: all;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 300ms;
  overflow: hidden;

  background-color: #111;

  iframe {
    display: none;
  }

  &:hover {
    ${Container} {
      width: fit-content;
    }
  }
`

const CopyButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 0;

  img {
    width: 16px;
    aspect-ratio: 1/1;
  }
`

const Icon = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  aspect-ratio: 1/1;
  border-radius: 50%;
  padding: 0.25rem;

  img {
    width: 16px;
    height: 16px;
  }
`

export default function Chotu() {
  const setAutheticated = useAuthStore((store) => store.setAuthenticated)
  window.addEventListener('message', (event) => {
    if (event.origin === 'http://localhost:3000') {
      console.log(event.data)
      setAutheticated(event.data.userDetails, event.data.workspaceDetails)
    }
  })
  return (
    <StyledChotu>
      <iframe src={'http://localhost:3000/chotu'} />
      <Icon>
        <img src={chrome.runtime.getURL('/assets/black_logo.svg')} />
      </Icon>

      <Container>
        <p>shortened</p>
        <CopyButton>
          <img src={chrome.runtime.getURL('/assets/copy.svg')} />
        </CopyButton>
      </Container>
    </StyledChotu>
  )
}
