import React, { useEffect } from 'react'

import addCircleLine from '@iconify/icons-ri/add-circle-line'
import { Icon } from '@iconify/react'

import { tinykeys } from '@workduck-io/tinykeys'

import { ContextMenuType, useLayoutStore } from '@mexit/core'
import { IconDisplay, isOnEditableElement, Tooltip } from '@mexit/shared'

import { CreateNewButton, SpaceItem, SpaceSwitcher, SwitcherSpaceItems } from './Sidebar.style'
import { SidebarSpace } from './Sidebar.types'

interface SidebarSpaceSwitcherProps {
  currentSpace: string
  spaces: SidebarSpace[]
  setCurrentIndex: (index: number) => void
  setNextSpaceIndex: (reverse?: boolean) => void
  isCreateDisabled?: boolean
  toolTip?: string
  onCreateNew?: () => void
  contextMenuType?: ContextMenuType
}

export const SidebarSpaceSwitcher = ({
  currentSpace,
  setNextSpaceIndex,
  spaces,
  setCurrentIndex,
  onCreateNew,
  toolTip,
  isCreateDisabled = true,
  contextMenuType
}: SidebarSpaceSwitcherProps) => {
  const sidebarWidth = useLayoutStore((s) => s.sidebar.width)
  const currentItemRef = React.useRef<HTMLDivElement>(null)
  const parentRef = React.useRef<HTMLDivElement>(null)
  const setContextMenu = useLayoutStore((s) => s.setContextMenu)

  const changeSpaceIndex = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      'Alt+ArrowRight': (e) => {
        if (!isOnEditableElement(e)) setNextSpaceIndex()
      },
      'Alt+ArrowLeft': (e) => {
        if (!isOnEditableElement(e)) setNextSpaceIndex(true)
      }
    })

    return () => unsubscribe()
  }, [currentSpace])

  useEffect(() => {
    if (currentItemRef.current && parentRef.current) {
      parentRef.current.scrollTo({
        left: currentItemRef.current.offsetLeft - sidebarWidth / 2,
        behavior: 'smooth'
      })
    }
  }, [currentItemRef.current, parentRef.current, sidebarWidth])

  return (
    <SpaceSwitcher>
      <SwitcherSpaceItems ref={parentRef}>
        {spaces.map((s, index) => (
          <Tooltip key={`spaceSwitcherItem_${s.id}`} content={s.data.granterID ? `Shared: ${s.label}` : s.label}>
            <SpaceItem
              sidebarWidth={sidebarWidth}
              totalItems={spaces.length}
              active={s.id === currentSpace}
              onContextMenu={(e) => {
                e.preventDefault()
                if (contextMenuType) {
                  setContextMenu({
                    type: contextMenuType,
                    item: s,
                    coords: {
                      x: e.clientX,
                      y: e.clientY
                    }
                  })
                }
              }}
              onClick={() => changeSpaceIndex(index)}
              ref={s.id === currentSpace ? currentItemRef : null}
            >
              <IconDisplay icon={s.icon} />
            </SpaceItem>
          </Tooltip>
        ))}
      </SwitcherSpaceItems>

      <Tooltip content={toolTip}>
        <span>
          <CreateNewButton disabled={isCreateDisabled} onClick={onCreateNew}>
            <Icon icon={addCircleLine} />
          </CreateNewButton>
        </span>
      </Tooltip>
    </SpaceSwitcher>
  )
}
