import React, { createRef, useRef, useState } from 'react'
import { useAuthStore } from '../../Hooks/useAuth'
import { useShortenerStore } from '../../Hooks/useShortener'
import {
  CategoryType,
  LinkCapture,
  MEXIT_FRONTEND_URL_BASE,
  Snippet,
  Theme,
  UserDetails,
  WorkspaceDetails
} from '@mexit/core'
import { useEffect } from 'react'
import { Container, CopyButton, Icon, StyledChotu } from './styled'
import useThemeStore from '../../Hooks/useThemeStore'
import useInternalAuthStore from '../../Hooks/useAuthStore'
import { Notification } from '@mexit/shared'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import toast from 'react-hot-toast'
import { AsyncMethodReturns, connectToChild } from 'penpal'

export default function Chotu() {
  const iframeRef = createRef<HTMLIFrameElement>()
  const linkCaptures = useShortenerStore((store) => store.linkCaptures)
  const setLinkCaptures = useShortenerStore((store) => store.setLinkCaptures)
  const addLinkCapture = useShortenerStore((store) => store.addLinkCapture)
  const setTheme = useThemeStore((store) => store.setTheme)

  const setAutheticated = useAuthStore((store) => store.setAuthenticated)
  const setInternalAuthStore = useInternalAuthStore((store) => store.setAllStore)
  const initSnippets = useSnippetStore((store) => store.initSnippets)
  const { setVisualState, search } = useSputlitContext()

  const [child, setChild] = useState<AsyncMethodReturns<any>>(null)

  useEffect(() => {
    const connection = connectToChild({
      iframe: iframeRef.current,
      methods: {
        init(
          userDetails: UserDetails,
          workspaceDetails: WorkspaceDetails,
          linkCaptures: LinkCapture[],
          theme: Theme,
          authAWS: any,
          snippets: Snippet[]
        ) {
          // Can be separated into multiple methods
          setAutheticated(userDetails, workspaceDetails)
          setLinkCaptures(linkCaptures)
          setTheme(theme)
          setInternalAuthStore(authAWS)
          initSnippets(snippets)
        },
        success(message: string) {
          toast.success(message)
        }
      },
      debug: true
    })

    connection.promise
      .then(async (child: any) => {
        const nodeItems = await child.search('node', search.value)
      })
      .catch((error) => {
        console.log(error)
      })

    return () => {
      connection.destroy()
    }
  }, [search])

  return (
    // TODO: Test this whenever shornter starts working
    <StyledChotu show={linkCaptures.some((item) => item.long === window.location.href)}>
      <iframe ref={iframeRef} src={`${MEXIT_FRONTEND_URL_BASE}/chotu`} id="chotu-iframe" />
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
