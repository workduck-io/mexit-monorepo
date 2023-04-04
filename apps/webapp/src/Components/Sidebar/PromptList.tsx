import React from 'react'

import { DefaultMIcons } from '@mexit/shared'

import usePrompts from '../../Hooks/usePrompts'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'

import SidebarList from './SidebarList'

const PromptList = () => {
  const { allPrompts } = usePrompts()

  const { goTo, getParams } = useRouting()
  const params = getParams(`${ROUTE_PATHS.prompt}/:promptId`)
  const promptId = params?.promptId ?? ''

  const sortedPrompts = allPrompts
    .map((l) => ({
      id: l.entityId,
      label: l.title,
      icon: DefaultMIcons.PROMPT,
      data: l
    }))
    .sort((a, b) => (a.label < b.label ? 1 : -1))

  const onOpenPrompt = (id: string) => {
    goTo(ROUTE_PATHS.prompt, NavigationType.push, id)
  }

  return (
    <SidebarList
      noMargin
      items={sortedPrompts}
      onClick={onOpenPrompt}
      selectedItemId={promptId}
      showSearch
      searchPlaceholder="Filter Prompts..."
      emptyMessage="No Prompts Found"
    />
  )
}

export default PromptList
