import React from 'react'
import { useAuthStore } from '../../Hooks/useAuth'
import { useShortenerStore } from '../../Hooks/useShortener'
import { MEXIT_FRONTEND_URL_BASE } from '@mexit/shared'
import { useEffect } from 'react'
import { Container, CopyButton, Icon, StyledChotu } from './styled'
import useThemeStore from '../../Hooks/useThemeStore'
import useInternalAuthStore from '../../Hooks/useAuthStore'
import { Notification } from '../Notification'

export default function Chotu() {
  const linkCaptures = useShortenerStore((store) => store.linkCaptures)
  const setLinkCaptures = useShortenerStore((store) => store.setLinkCaptures)
  const addLinkCapture = useShortenerStore((store) => store.addLinkCapture)
  const setTheme = useThemeStore((store) => store.setTheme)

  const setAutheticated = useAuthStore((store) => store.setAuthenticated)
  const setInternalAuthStore = useInternalAuthStore((store) => store.setAllStore)

  const handleEvent = (event) => {
    if (event.origin === MEXIT_FRONTEND_URL_BASE) {
      switch (event.data.type) {
        case 'store-init': {
          setAutheticated(event.data.userDetails, event.data.workspaceDetails)
          setLinkCaptures(event.data.linkCapture)
          setTheme(event.data.theme)
          setInternalAuthStore(event.data.authAWS)
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

      <Notification />
    </StyledChotu>
  )
}
