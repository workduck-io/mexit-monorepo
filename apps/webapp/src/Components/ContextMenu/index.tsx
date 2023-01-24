import useContextMenu from '../../Hooks/useContextMenu'
import { useLayoutStore } from '../../Stores/useLayoutStore'

import { ContextMenuContainer, ContextMenuItem } from './MenuContainer'

const ContextMenu = () => {
  const contextMenuType = useLayoutStore((s) => s.contextMenu)
  const menuItems = useContextMenu()

  if (!contextMenuType) return

  return (
    <ContextMenuContainer>
      {menuItems.map((item) => {
        return (
          <ContextMenuItem
            key={item.id}
            icon={item.icon}
            disabled={item.disabled}
            label={item.label}
            onClick={item.onSelect}
          />
        )
      })}
    </ContextMenuContainer>
  )
}

export default ContextMenu
