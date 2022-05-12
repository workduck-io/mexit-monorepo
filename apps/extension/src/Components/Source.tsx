/* eslint-disable react/prop-types */
import { NodeMetadata } from '@mexit/core'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

export const getHtmlString = (url: string) => {
  return ReactDOMServer.renderToStaticMarkup(<Source url={url} />)
}

const Source: React.FC<{ url: string }> = ({ url }) => {
  if (!url) {
    return null
  }

  return (
    <>
      {'  ['}
      <a href={url} target="_blank" rel="noopener noreferrer">
        Ref
      </a>
      {' ]'}
    </>
  )
}

export default Source
