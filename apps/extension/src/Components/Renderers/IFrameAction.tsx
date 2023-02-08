import React, { useEffect, useRef } from 'react'

import styled from 'styled-components'

import { API_BASE_URLS } from '@mexit/core'
import { parsePageMetaTags } from '@mexit/shared'

import { useSputlitContext } from '../../Hooks/useSputlitContext'
import { useSputlitStore } from '../../Stores/useSputlitStore'

const Iframe = styled.iframe`
  border: none;
  margin: 0;
  padding: 0;
  width: 100%;
`

const IFrameActionRenderer = () => {
  const { setIsLoading } = useSputlitContext()
  const activeItem = useSputlitStore((s) => s.activeItem)
  const setActiveItem = useSputlitStore((s) => s.setActiveItem)

  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleEvent = (event) => {
    const url = API_BASE_URLS.frontend
    if (event.origin === url) {
      switch (event.data.type) {
        case 'height-init':
          setIsLoading(false)
          iframeRef.current.height = event.data.height + 'px'
          break
        case 'tab-info-request': {
          const pageTags = parsePageMetaTags(window.document)
          iframeRef.current.contentWindow.postMessage(
            {
              type: 'tab-info-response',
              data: {
                url: window.location.href,
                pageTags
              }
            },
            url
          )
          break
        }
        default:
          break
      }
    }
  }

  useEffect(() => {
    setIsLoading(true)
    window.addEventListener('message', handleEvent)

    return () => {
      window.removeEventListener('message', handleEvent)
      setActiveItem()
    }
  }, [])

  return <Iframe ref={iframeRef} id="action-component" src={activeItem?.extras?.base_url} allow="clipboard-write" />
}

export default IFrameActionRenderer
