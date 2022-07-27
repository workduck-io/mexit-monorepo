import React from 'react'

import hashtag from '@iconify/icons-ri/hashtag'
import { useMatch } from 'react-router-dom'

import { mog } from '@mexit/core'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useTags } from '../../Hooks/useTags'
import SidebarList from './SidebarList'

const TagList = () => {
  const { getAllTags } = useTags()
  // const { tag } = useParams<{ tag: string }>()
  const isTagsView = useMatch(`${ROUTE_PATHS.tag}/:tag`)
  // const [tags, setTags] = useState(Object.keys(cleanCache))
  const tags = getAllTags().map((t) => ({
    id: t,
    title: t,
    icon: hashtag
  }))

  const tag = isTagsView && isTagsView.params?.tag

  const { goTo } = useRouting()

  const navigateToTag = (tag: string) => {
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  mog('Tags', { tags, isTagsView, tag })

  return (
    <SidebarList
      showSearch
      searchPlaceholder="Filter tags..."
      emptyMessage="No tags found"
      items={tags}
      selectedItemId={tag}
      onClick={navigateToTag}
    />
  )
}

export default TagList
