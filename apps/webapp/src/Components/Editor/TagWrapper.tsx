import React from 'react'
import { TagElementProps, TagElement } from '@workduck-io/mex-editor'
import { mog } from "@mexit/core"

const TagWrapper = (props: TagElementProps) => {
  const handleTagClick = (tag: string) => {
    mog('Clicked on Tag', { tag })
  }

  return <TagElement {...props} onClick={handleTagClick} />
}

export default TagWrapper
