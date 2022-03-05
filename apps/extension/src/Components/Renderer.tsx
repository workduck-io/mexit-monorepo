import { MEXIT_FRONTEND_URL_BASE } from '@mexit/shared'
import React, { Suspense } from 'react'
import { useCallback } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'
import { useSputlitContext } from '../Hooks/useSputlitContext'

const Iframe = styled.iframe`
  border: none;
  margin: 0;
  padding: 0;
  width: 100%;
`

const Renderer = () => {
  const activeItem = useSputlitContext().activeItem
  const iframeRef = useRef(null)

  const handleEvent = (event) => {
    if (event.origin === MEXIT_FRONTEND_URL_BASE) {
      switch (event.data.type) {
        case 'height-init':
          iframeRef.current.height = event.data.height + 'px'
          break
        case 'tab-info-request': {
          iframeRef.current.contentWindow.postMessage(
            {
              type: 'tab-info-response',
              data: {
                url: window.location.href
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
    window.addEventListener('message', handleEvent)

    return () => {
      window.removeEventListener('message', handleEvent)
    }
  }, [])

  return <Iframe ref={iframeRef} id="action-component" src={activeItem.item.data.src} />
}

export default Renderer
