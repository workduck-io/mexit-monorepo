import React from 'react'

import { mog } from '@mexit/core'
import { TagElementProps } from '@mexit/shared'

import TagElement from '../../Editor/Components/Tags/TagElement'

const TagWrapper = (props: TagElementProps) => {
  const handleTagClick = (tag: string) => {
    mog('Clicked on Tag', { tag })
  }

  return <TagElement {...props} onClick={() => handleTagClick(props?.element?.value)} />
}

export default TagWrapper
