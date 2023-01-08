import React from 'react'
import { useParams } from 'react-router-dom'

import { DefaultMIcons } from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { usePromptStore } from '../../Stores/usePromptStore'

import { SidebarWrapper } from './Sidebar.style'
import SidebarList from './SidebarList'

const PromptList = () => {
  const downloadedPrompts = usePromptStore((s) => s.downloaded)
  const createdPrompts = usePromptStore((s) => s.created)
  const defaultPrompts = usePromptStore((s) => s.defaults)

  const params = useParams()
  const promptId = params?.promptId

  const { goTo } = useRouting()

  const sortedPrompts = React.useMemo(() => {
    return [
      ...downloadedPrompts.map((l) => ({
        id: l.entityId,
        label: l.title,
        icon: DefaultMIcons.PROMPT,
        data: l
      })),
      ...defaultPrompts.map((l) => ({
        id: l.entityId,
        label: l.title,
        icon: DefaultMIcons.PROMPT,
        data: l
      })),
      ...createdPrompts.map((l) => ({
        id: l.entityId,
        label: l.title,
        icon: DefaultMIcons.PROMPT,
        data: l
      }))
    ].sort((a, b) => (a.label < b.label ? 1 : -1))
  }, [downloadedPrompts, createdPrompts, defaultPrompts])

  const onOpenPrompt = (id: string) => {
    goTo(ROUTE_PATHS.prompt, NavigationType.push, id)
  }

  return (
    <SidebarWrapper>
      {/* <SidebarHeaderLite title={`Snippets (${sortedPrompts.length})`} icon={quillPenLine} /> */}
      <SidebarList
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
