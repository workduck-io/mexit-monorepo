import { useLayoutStore } from '@mexit/core'

import useContextMenu from '../../Hooks/useContextMenu'

import { ContextMenuContainer, ContextMenuItem } from './MenuContainer'

const ContextMenu = () => {
  const contextMenuType = useLayoutStore((s) => s.contextMenu)

  const menuItems = useContextMenu()

  if (!contextMenuType || !menuItems) return

  return (
    <ContextMenuContainer handleClose>
      {menuItems.map((item) => {
        if (item.options) {
          return (
            <ContextMenuContainer label={item.label} icon={item.icon} disabled={item.disabled}>
              {item.options.map((option) => (
                <ContextMenuItem
                  key={option.id}
                  icon={option.icon}
                  disabled={option.disabled}
                  label={option.label}
                  onClick={option.onSelect}
                />
              ))}
            </ContextMenuContainer>
          )
        }

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
