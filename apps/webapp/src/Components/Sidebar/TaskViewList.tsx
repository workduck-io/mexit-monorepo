import React from 'react'

import home7Line from '@iconify/icons-ri/home-7-line'
import stackLine from '@iconify/icons-ri/stack-line'
import timerFlashLine from '@iconify/icons-ri/timer-flash-line'

import { reminderViewPlaceholderData } from '@mexit/core'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useViewStore } from '../../Hooks/useTaskViews'
import { SidebarHeaderLite } from './Sidebar.space.header'
import { SidebarWrapper } from './Sidebar.style'
import SidebarList from './SidebarList'
import TaskViewContextMenu from './TaskViewContextMenu'

const TaskViewList = () => {
  const views = useViewStore((store) => store.views)
  const currentView = useViewStore((store) => store.currentView)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { goTo } = useRouting()

  const onOpenDefaultView = () => {
    // loadSnippet(id)
    setCurrentView(undefined)
    goTo(ROUTE_PATHS.tasks, NavigationType.push)
  }
  const onOpenReminderView = () => {
    //Doing this as a temporary fix for switching to reminder view
    setCurrentView(reminderViewPlaceholderData)
    goTo(`${ROUTE_PATHS.reminders}`, NavigationType.push)
  }

  const onOpenView = (viewid: string) => {
    // loadSnippet(id)
    if (viewid === 'default') {
      onOpenDefaultView()
    } else if (viewid === 'reminder') {
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
        icon: stackLine
      }))
  }, [views])

  return (
    <SidebarWrapper>
      <SidebarHeaderLite title="Task Views" icon={stackLine} />
      <SidebarList
        ItemContextMenu={TaskViewContextMenu}
        items={sortedViews}
        onClick={(item) => onOpenView(item)}
        selectedItemId={currentView?.id || 'default'}
        showSearch
        searchPlaceholder="Filter Task Views..."
        defaultItems={[
          {
            label: 'Default',
            id: 'default',
            icon: home7Line,
            data: {}
          },
          {
            label: 'Reminder',
            id: 'reminder',
            icon: timerFlashLine,
            data: {}
          }
        ]}
      />
    </SidebarWrapper>
  )
}

export default TaskViewList
