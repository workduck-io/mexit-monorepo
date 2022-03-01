import { MEXIT_FRONTEND_URL_BASE } from '@mexit/shared'
import React, { Suspense } from 'react'
import styled from 'styled-components'

const Iframe = styled.iframe`
  border: none;
  margin: 0;
  padding: 0;
`

const Renderer = ({ componentSrc }: { componentSrc: string }) => {
  document
    .getElementById('action-component')
    // @ts-ignore
    .contentWidnow.postMessage(
      { type: 'tab-info', title: document.title, url: window.location.href },
      MEXIT_FRONTEND_URL_BASE
    )

  return <Iframe id="action-component" src={componentSrc} />
}

export default Renderer
