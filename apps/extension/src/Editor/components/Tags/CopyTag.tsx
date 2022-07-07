import * as React from 'react'
import { TagElementProps } from './TagElement.types'

export const CopyTag = ({ attributes, children, element }: TagElementProps) => {
  return (
    <span {...attributes} data-slate-value={element.value} contentEditable={false}>
      #{element.value}
      {children}
    </span>
  )
}
