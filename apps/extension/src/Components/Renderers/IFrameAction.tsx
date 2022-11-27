import { MEXIT_FRONTEND_URL_BASE } from '@mexit/core'
import { parsePageMetaTags } from '@mexit/shared'
import React, { useEffect,useRef  } from 'react'
import styled from 'styled-components'

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

export default IFrameActionRenderer
