import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import stackLine from '@iconify/icons-ri/stack-line'

import { ContextMenuType, ReminderViewData, useLayoutStore, ViewType } from '@mexit/core'
import { DefaultMIcons, getMIcon, IconDisplay } from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { getBlockFieldIcon } from '../../Hooks/useSortIcons'
import { useViewStore } from '../../Stores/useViewStore'
import { useTaskViewModalStore } from '../TaskViewModal'

import { SidebarHeaderLite } from './Sidebar.space.header'
import { CreateNewNoteSidebarButton, SidebarWrapper, VerticalSpace } from './Sidebar.style'
import SidebarViewTree from './Sidebar.views'

const ViewList = () => {
  const setContextMenu = useLayoutStore((store) => store.setContextMenu)
  const openTaskViewModal = useTaskViewModalStore((store) => store.openModal)

  const { goTo } = useRouting()

  const onOpenView = (viewid: string) => {
    goTo(ROUTE_PATHS.view, NavigationType.push, viewid)
  }

  const handleContextMenu = (id: string, event) => {
    const view = useViewStore.getState().views?.find((view) => view.id === id)

    setContextMenu({
      type: ContextMenuType.VIEW_LIST,
      item: { data: view },
      coords: {
        x: event.clientX,
        y: event.clientY
      }
    })
  }

  const handleCreateNewView = () => {
    openTaskViewModal({
      filters: [],
      properties: {
        globalJoin: 'all',
        viewType: ViewType.List,
        sortOrder: 'ascending'
      }
    })
  }

  return (
    <SidebarWrapper>
      <SidebarHeaderLite title="Views" icon={stackLine} />

      <VerticalSpace>
        <CreateNewNoteSidebarButton onClick={handleCreateNewView}>
          <IconDisplay size={24} icon={DefaultMIcons.ADD} />
          New View
        </CreateNewNoteSidebarButton>
      </VerticalSpace>

      <ErrorBoundary fallbackRender={() => <></>}>
        <SidebarViewTree
          onContextMenu={handleContextMenu}
          onClick={(item) => onOpenView(item)}
          defaultItems={[
            {
              label: 'Tasks',
              id: 'tasks',
              icon: getBlockFieldIcon('status'),
              data: {}
            },
            {
              label: 'Personal',
              id: ReminderViewData.id,
              icon: getMIcon('ICON', 'ri:user-line'),
              data: {}
            }
          ]}
        />
      </ErrorBoundary>
    </SidebarWrapper>
  )
}

export default ViewList
