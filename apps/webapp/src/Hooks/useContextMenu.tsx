import { DefaultMIcons, isReservedNamespace, MIcon } from '@mexit/core'

import { ContextMenuType, useLayoutStore } from '../Stores/useLayoutStore'
import useModalStore, { ModalsType } from '../Stores/useModalStore'

import { useCreateNewMenu } from './useCreateNewMenu'

type ContextMenuListItemType = {
  id: string
  label: string
  disabled?: boolean
  icon?: MIcon
  onSelect: any
}

const useContextMenu = (): Array<ContextMenuListItemType> => {
  const contextMenu = useLayoutStore((store) => store.contextMenu)
  const openModal = useModalStore((store) => store.toggleOpen)

  const { getCreateNewMenuItems } = useCreateNewMenu()

  if (!contextMenu?.type) return

  const onDeleteNamespace = () => {
    const item = useLayoutStore.getState().contextMenu?.item
    openModal(ModalsType.deleteSpace, item)
  }

  switch (contextMenu.type) {
    case ContextMenuType.NOTE_PLUS_BUTTON:
      return getCreateNewMenuItems()
    case ContextMenuType.NOTE_NAMESPACE:
      // eslint-disable-next-line no-case-declarations
      const spaceData = contextMenu?.item?.data,
        disabled = spaceData?.access !== 'OWNER' || isReservedNamespace(spaceData?.name)

      return [
        {
          id: 'delete-namespace',
          label: 'Delete Space',
          disabled,
          icon: DefaultMIcons.DELETE,
          onSelect: () => {
            if (!disabled) onDeleteNamespace()
          }
        }
      ]
    default:
      break
  }
}

export default useContextMenu
