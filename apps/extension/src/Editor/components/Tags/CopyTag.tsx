import { TagElementProps } from '@mexit/shared'
import React from 'react'

export const CopyTag = ({ attributes, children, element }: TagElementProps) => {
  return (
    <span {...attributes} data-slate-value={element.value} contentEditable={false}>
      #{element.value}
      {children}
    </span>
  )
}
