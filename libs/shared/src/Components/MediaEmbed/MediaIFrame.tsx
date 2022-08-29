import React from 'react'

import { IFrame } from './MediaEmbedElement.styles'

export const parseRestMediaUrls = (url: string) => {
  return {
    id: `media-iframe-${url}`,
    provider: 'mex-media-iframe',
    url
  }
}

export const MediaIFrame = (props: any) => {
  return <IFrame {...props} />
}
