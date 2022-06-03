import React from 'react'
import { mog } from '@mexit/core'
import TagElement from '../../Editor/Components/Tags/TagElement'
import { TagElementProps } from '../../Editor/Types/TagElement'

const TagWrapper = (props: TagElementProps) => {
  const handleTagClick = (tag: string) => {
    mog('Clicked on Tag', { tag })
  }

  return <TagElement {...props} onClick={handleTagClick} />
}

export default TagWrapper
