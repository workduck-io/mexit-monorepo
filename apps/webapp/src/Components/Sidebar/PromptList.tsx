import React from 'react'
import { useParams } from 'react-router-dom'

import { DefaultMIcons } from '@mexit/shared'

import usePrompts from '../../Hooks/usePrompts'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'

import { SidebarWrapper } from './Sidebar.style'
import SidebarList from './SidebarList'

const PromptList = () => {
  const { allPrompts } = usePrompts()
  const params = useParams()
  const promptId = params?.promptId

  const { goTo } = useRouting()

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
    <SidebarWrapper>
      {/* <SidebarHeaderLite title={`Snippets (${sortedPrompts.length})`} icon={quillPenLine} /> */}
      <SidebarList
        noMargin
        items={sortedPrompts}
        onClick={onOpenPrompt}
        selectedItemId={promptId ?? ''}
        showSearch
        searchPlaceholder="Filter Prompts..."
        emptyMessage="No Prompts Found"
      />
    </SidebarWrapper>
  )
}

export default PromptList
