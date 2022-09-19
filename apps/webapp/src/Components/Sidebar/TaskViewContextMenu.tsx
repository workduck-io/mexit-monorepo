import React from 'react'

import trashIcon from '@iconify/icons-codicon/trash'
import fileCopyLine from '@iconify/icons-ri/file-copy-line'
import { Icon } from '@iconify/react'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { View, useViewStore, useTaskViews } from '../../Hooks/useTaskViews'
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '../../Style/contextMenu'
import { useTaskViewModalStore } from '../TaskViewModal'
import { SidebarListItem } from './SidebarList'

interface TaskViewContextMenuProps {
  item: SidebarListItem<View<any>>
}

const TaskViewContextMenu = ({ item }: TaskViewContextMenuProps) => {
  // const removeView = useViewStore((store) => store.removeView)
  const openModal = useTaskViewModalStore((store) => store.openModal)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { goTo } = useRouting()
  // const { deleteView } = useTaskViews()

  const handleDelete = async (view: View<any>) => {
    const currentView = useViewStore.getState().currentView
    // TODO: this is related to syncing tasks views with backend, needs to be done but now
    // await deleteView(view.id)
    if (currentView?.id === view.id) {
      setCurrentView(undefined)
      goTo(ROUTE_PATHS.tasks, NavigationType.push)
    }
  }

  const handleClone = (view: View<any>) => {
    openModal({ filters: view.filters, cloneViewId: view.id })
  }

  return (
    <>
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
    </>
  )
}

export default TaskViewContextMenu
