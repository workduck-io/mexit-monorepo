import React from 'react'
import { TagElementProps, TagElement, mog } from '@workduck-io/mex-editor'

const TagWrapper = (props: TagElementProps) => {
  const handleTagClick = (tag: string) => {
    mog('Clicked on Tag', { tag })
  }

  return <TagElement {...props} onClick={handleTagClick} />
}

export { TagWrapper }
