import React, { Suspense } from 'react'
import styled from 'styled-components'

const Iframe = styled.iframe`
  border: none;
  margin: 0;
  padding: 0;
`

const Renderer = ({ componentSrc }: { componentSrc: string }) => {
  return <Iframe src={componentSrc} />
}

export default Renderer
