import React, { useEffect } from 'react'

import addCircleLine from '@iconify/icons-ri/add-circle-line'
import { Icon } from '@iconify/react'

import { tinykeys } from '@workduck-io/tinykeys'

import { IconDisplay, isOnEditableElement, Tooltip } from '@mexit/shared'

import { useLayoutStore } from '../../Stores/useLayoutStore'

import { CreateNewMenu } from './Sidebar.createNew'
import { CreateNewButton, SpaceItem, SpaceSwitcher, SwitcherSpaceItems } from './Sidebar.style'
import { SidebarSpace } from './Sidebar.types'

interface SidebarSpaceSwitcherProps {
  currentSpace: string
  spaces: SidebarSpace[]
  setCurrentIndex: (index: number) => void
  setNextSpaceIndex: (reverse?: boolean) => void
  createNewMenuItems: Array<any>
}

export const SidebarSpaceSwitcher = ({
  currentSpace,
  setNextSpaceIndex,
  spaces,
  setCurrentIndex,
  createNewMenuItems
}: SidebarSpaceSwitcherProps) => {
  const sidebarWidth = useLayoutStore((s) => s.sidebar.width)
  const currentItemRef = React.useRef<HTMLDivElement>(null)
  const parentRef = React.useRef<HTMLDivElement>(null)

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
              onClick={() => changeSpaceIndex(index)}
              ref={s.id === currentSpace ? currentItemRef : null}
            >
              <IconDisplay icon={s.icon} />
            </SpaceItem>
          </Tooltip>
        ))}
      </SwitcherSpaceItems>

      <CreateNewMenu menuItems={createNewMenuItems}>
        <CreateNewButton>
          <Icon icon={addCircleLine} />
        </CreateNewButton>
      </CreateNewMenu>
    </SpaceSwitcher>
  )
}
