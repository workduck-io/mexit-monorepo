import React from 'react'
import { useAuthStore } from '../Hooks/useAuth'
import styled from 'styled-components'
import { useShortenerStore } from '../Hooks/useShortener'
import { css } from 'styled-components'
import { useCallback } from 'react'
import { MEXIT_FRONTEND_URL_BASE } from '@mexit/shared'
import { useEffect } from 'react'
import { useSputlitContext } from '../Hooks/useSputlitContext'

const Container = styled.div`
  display: flex;
  align-items: center;

  width: 0;
  height: 0;

  p {
    margin: 0 0.5rem !important;
  }
`

const StyledChotu = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? css`flex` : css`none`)};
  align-items: center;
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0.25rem;

  cursor: pointer;

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
  const linkCaptures = useShortenerStore((store) => store.linkCaptures)
  const setLinkCaptures = useShortenerStore((store) => store.setLinkCaptures)
  const addLinkCapture = useShortenerStore((store) => store.addLinkCapture)

  const setAutheticated = useAuthStore((store) => store.setAuthenticated)

  const handleEvent = (event) => {
    if (event.origin === MEXIT_FRONTEND_URL_BASE) {
      switch (event.data.type) {
        case 'store-init': {
          setAutheticated(event.data.userDetails, event.data.workspaceDetails)
          setLinkCaptures(event.data.linkCapture)
          break
        }
        case 'shortener': {
          if (event.data.status === 200) {
            console.log('Received: ', event.data.message)
            addLinkCapture(event.data.message)
          } else {
            console.error('Received: ', event.data)
          }
          break
        }
        default:
          break
      }
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleEvent)
    return () => {
      window.removeEventListener('message', handleEvent)
    }
  }, [])
  return (
    // TODO: Test this whenever shornter starts working
    <StyledChotu show={linkCaptures.some((item) => item.long === window.location.href)}>
      <iframe src={`${MEXIT_FRONTEND_URL_BASE}/chotu`} id="chotu-iframe" />
      <Icon>
        <img src={chrome.runtime.getURL('/Assets/black_logo.svg')} />
      </Icon>

      <Container>
        <p>shortened</p>
        <CopyButton>
          <img src={chrome.runtime.getURL('/Assets/copy.svg')} />
        </CopyButton>
      </Container>
    </StyledChotu>
  )
}
