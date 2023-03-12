import React from 'react'

import stackLine from '@iconify/icons-ri/stack-line'

import { generateTaskViewId, getMIcon, ReminderViewData, ViewType } from '@mexit/core'
import { DefaultMIcons, IconDisplay } from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { getSortTypeIcon } from '../../Hooks/useSortIcons'
import { ContextMenuType, useLayoutStore } from '../../Stores/useLayoutStore'
import { useViewStore } from '../../Stores/useViewStore'
import { useTaskViewModalStore } from '../TaskViewModal'

import { SidebarHeaderLite } from './Sidebar.space.header'
import { CreateNewNoteSidebarButton, SidebarWrapper, VerticalSpace } from './Sidebar.style'
import SidebarList from './SidebarList'

const ViewList = () => {
  const views = useViewStore((store) => store.views)
  const currentView = useViewStore((store) => store.currentView)
  const setContextMenu = useLayoutStore((store) => store.setContextMenu)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const openTaskViewModal = useTaskViewModalStore((store) => store.openModal)

  const { goTo } = useRouting()

  const onOpenDefaultView = (path: string = ROUTE_PATHS.tasks) => {
    setCurrentView(undefined)
    goTo(path, NavigationType.push)
  }

  const onOpenReminderView = () => {
    setCurrentView(ReminderViewData)
    goTo(`${ROUTE_PATHS.reminders}`, NavigationType.push)
  }

  const onOpenView = (viewid: string) => {
    if (viewid === 'tasks') {
      onOpenDefaultView()
    } else if (viewid === 'reminders') {
      onOpenReminderView()
    } else {
      const view = views.find((view) => view.id === viewid)
      if (view) {
        setCurrentView(view)
        goTo(ROUTE_PATHS.view, NavigationType.push, view.id)
      }
    }
  }

  const sortedViews = React.useMemo(() => {
    return views
      .sort((a, b) => {
        if (a.title < b.title) {
          return -1
        }
        if (a.title > b.title) {
          return 1
        }
        return 0
      })
      .map(({ title, ...t }) => ({
        ...t,
        label: title,
        data: t,
        icon: DefaultMIcons.VIEW
      }))
  }, [views])

  const handleContextMenu = (item, event) => {
    setContextMenu({
      type: ContextMenuType.VIEW_LIST,
      item,
      coords: {
        x: event.clientX,
        y: event.clientY
      }
    })
  }

  const handleCreateNewView = () => {
    openTaskViewModal({
      filters: [],
      cloneViewId: generateTaskViewId(),
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

      <SidebarList
        items={sortedViews}
        onContextMenu={handleContextMenu}
        onClick={(item) => onOpenView(item)}
        selectedItemId={currentView?.id || 'tasks'}
        showSearch
        searchPlaceholder="Filter Views..."
        defaultItems={[
          {
            label: 'Tasks',
            id: 'tasks',
            icon: getSortTypeIcon('status'),
            data: {}
          },
          {
            label: 'Reminders',
            id: ReminderViewData.id,
            icon: getMIcon('ICON', 'ri:timer-flash-line'),
            data: {}
          }
        ]}
      />
    </SidebarWrapper>
  )
}

export default ViewList
