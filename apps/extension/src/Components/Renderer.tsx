import { MEXIT_FRONTEND_URL_BASE } from '@mexit/core'
import { parsePageMetaTags } from '@mexit/shared'
import { AsyncMethodReturns, connectToChild } from 'penpal'
import React, { createRef, Suspense, useState } from 'react'
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
  const { activeItem, setIsLoading } = useSputlitContext()
  const iframeRef = createRef<HTMLIFrameElement>()
  const [child, setChild] = useState<AsyncMethodReturns<any>>(null)

  // useEffect(() => {
  //   setIsLoading(true)
  //   const connection = connectToChild({
  //     iframe: iframeRef.current,
  //     methods: {
  //       resize(value: number) {
  //         iframeRef.current.height = value + 'px'
  //         setIsLoading(false)
  //       },
  //       tabInfo() {
  //         const tags = parsePageMetaTags(window.document)

  //         return {
  //           url: window.location.href,
  //           tags
  //         }
  //       }
  //     },
  //     debug: true
  //   })

  //   connection.promise
  //     .then((child) => {
  //       setChild(child)
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })

  //   return () => {
  //     connection.destroy()
  //     setChild(null)
  //   }
  // }, [])

  return <Iframe ref={iframeRef} id="action-component" src={activeItem.data.src} />
}

export default Renderer
