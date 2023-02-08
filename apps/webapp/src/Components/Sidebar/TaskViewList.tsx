import React from 'react'

import stackLine from '@iconify/icons-ri/stack-line'

import { DefaultMIcons, getMIcon, ReminderViewData } from '@mexit/core'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useViewStore } from '../../Hooks/useTaskViews'
import { ContextMenuType, useLayoutStore } from '../../Stores/useLayoutStore'

import { SidebarHeaderLite } from './Sidebar.space.header'
import { SidebarWrapper } from './Sidebar.style'
import SidebarList from './SidebarList'

const TaskViewList = () => {
  const views = useViewStore((store) => store.views)
  const currentView = useViewStore((store) => store.currentView)
  const setContextMenu = useLayoutStore((store) => store.setContextMenu)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { goTo } = useRouting()

  const onOpenDefaultView = () => {
    // loadSnippet(id)
    setCurrentView(undefined)
    goTo(ROUTE_PATHS.tasks, NavigationType.push)
  }
  const onOpenReminderView = () => {
    //Doing this as a temporary fix for switching to reminder view
    setCurrentView(ReminderViewData)
    goTo(`${ROUTE_PATHS.reminders}`, NavigationType.push)
  }

  const onOpenView = (viewid: string) => {
    // loadSnippet(id)
    if (viewid === 'default') {
      onOpenDefaultView()
    } else if (viewid === 'reminders') {
      onOpenReminderView()
    } else {
      const view = views.find((view) => view.id === viewid)
      if (view) {
        setCurrentView(view)
        goTo(ROUTE_PATHS.tasks, NavigationType.push, view.id)
      }
    }
  }

  // const showSelected = useMemo(() => {
  //   if (location.pathname === ROUTE_PATHS.tasks) {
  //     return false
  //   }
  //   return true
  // }, [location.pathname])

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

  return (
    <SidebarWrapper>
      <SidebarHeaderLite title="Task Views" icon={stackLine} />
      <SidebarList
        items={sortedViews}
        onContextMenu={handleContextMenu}
        onClick={(item) => onOpenView(item)}
        selectedItemId={currentView?.id || 'default'}
        showSearch
        searchPlaceholder="Filter Task Views..."
        defaultItems={[
          {
            label: 'Default',
            id: 'default',
            icon: getMIcon('ICON', 'ri:home-7-line'),
            data: {}
          },
          {
            label: 'Reminder',
            id: ReminderViewData.id,
            icon: getMIcon('ICON', 'ri:timer-flash-line'),
            data: {}
          }
        ]}
      />
    </SidebarWrapper>
  )
}

export default TaskViewList
