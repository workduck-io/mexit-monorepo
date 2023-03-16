import { ContextMenuType, MIcon, useLayoutStore } from '@mexit/core'

import { useCreateNewMenu } from './useCreateNewMenu'

type ContextMenuListItemType = {
  id: string
  label: string
  disabled?: boolean
  icon?: MIcon
  onSelect: any
  options?: Array<ContextMenuListItemType>
}

const useContextMenu = (): Array<ContextMenuListItemType> => {
  const contextMenu = useLayoutStore((store) => store.contextMenu)

  const { getCreateNewMenuItems, getSpaceMenuItems, getBlockMenuItems, getTreeMenuItems, getViewMenuItems } =
    useCreateNewMenu()

  if (!contextMenu?.type) return

  switch (contextMenu.type) {
    case ContextMenuType.NOTES_TREE:
      return getTreeMenuItems()
    case ContextMenuType.NOTE_PLUS_BUTTON:
      return getCreateNewMenuItems()
    case ContextMenuType.EDITOR:
      return getBlockMenuItems()
    case ContextMenuType.VIEW_LIST:
      return getViewMenuItems()
    case ContextMenuType.NOTE_NAMESPACE:
      return getSpaceMenuItems()
    default:
      break
  }
}

export default useContextMenu
