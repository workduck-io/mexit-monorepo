import React, { createRef, Suspense, useState } from 'react'
import { useCallback } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'

import { AsyncMethodReturns, connectToChild } from 'penpal'
import styled from 'styled-components'

import { MEXIT_FRONTEND_URL_BASE } from '@mexit/core'
import { parsePageMetaTags } from '@mexit/shared'

import { useSputlitContext } from '../Hooks/useSputlitContext'

const Iframe = styled.iframe`
  border: none;
  margin: 0;
  padding: 0;
  width: 100%;
`

const Renderer = () => {
  const { activeItem, setActiveItem, setIsLoading } = useSputlitContext()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleEvent = (event) => {
    if (event.origin === MEXIT_FRONTEND_URL_BASE) {
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
            MEXIT_FRONTEND_URL_BASE
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

export default Renderer
