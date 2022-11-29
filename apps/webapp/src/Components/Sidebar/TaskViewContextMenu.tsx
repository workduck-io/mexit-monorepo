import trashIcon from '@iconify/icons-codicon/trash'
import fileCopyLine from '@iconify/icons-ri/file-copy-line'
import { Icon } from '@iconify/react'
import React from 'react'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useTaskViews,useViewStore, View } from '../../Hooks/useTaskViews'
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '../../Style/contextMenu'
import { useTaskViewModalStore } from '../TaskViewModal'
import { SidebarListItem } from './SidebarList'

interface TaskViewContextMenuProps {
  item: SidebarListItem<View>
}

const TaskViewContextMenu = ({ item }: TaskViewContextMenuProps) => {
  // const removeView = useViewStore((store) => store.removeView)
  const openModal = useTaskViewModalStore((store) => store.openModal)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { goTo } = useRouting()
  const { deleteView } = useTaskViews()

  const handleDelete = async (view: View) => {
    const currentView = useViewStore.getState().currentView
    await deleteView(view.id)
    if (currentView?.id === view.id) {
      setCurrentView(undefined)
      goTo(ROUTE_PATHS.tasks, NavigationType.push)
    }
  }

  const handleClone = (view: View) => {
    openModal({ filters: view.filters, cloneViewId: view.id, globalJoin: view.globalJoin })
  }

  return (
    <ContextMenuContent>
      <ContextMenuItem
        onSelect={(args) => {
          handleClone(item.data)
        }}
      >
        <Icon icon={fileCopyLine} />
        Clone
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        color="#df7777"
        onSelect={(args) => {
          handleDelete(item.data)
        }}
      >
        <Icon icon={trashIcon} />
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  )
}

export default TaskViewContextMenu
