import React from 'react'

import { CaptureHighlightWrapper } from './styled'

export const CaptureElement = ({ attribute, children, nodeProps }) => {
  return <CaptureHighlightWrapper {...attribute} {...nodeProps}>
    {children}
  </CaptureHighlightWrapper>
}
