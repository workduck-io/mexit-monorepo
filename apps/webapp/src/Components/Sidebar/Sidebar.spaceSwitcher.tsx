import React, { useEffect } from 'react'

import addCircleLine from '@iconify/icons-ri/add-circle-line'
import { Icon } from '@iconify/react'

import { useLayoutStore } from '../../Stores/useLayoutStore'
import { Tooltip } from '../FloatingElements/Tooltip'
import IconDisplay from '../IconPicker/IconDisplay'
import { CreateNewMenu } from './Sidebar.createNew'
import { CreateNewButton, SpaceItem, SpaceSwitcher, SwitcherSpaceItems } from './Sidebar.style'
import { SidebarSpace } from './Sidebar.types'

interface SidebarSpaceSwitcherProps {
  currentSpace: string
  spaces: SidebarSpace[]
  setCurrentIndex: (index: number) => void
}

export const SidebarSpaceSwitcher = ({ currentSpace, spaces, setCurrentIndex }: SidebarSpaceSwitcherProps) => {
  const sidebarWidth = useLayoutStore((s) => s.sidebar.width)
  const currentItemRef = React.useRef<HTMLDivElement>(null)
  const parentRef = React.useRef<HTMLDivElement>(null)

  const changeSpaceIndex = (index: number) => {
    setCurrentIndex(index)
  }

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
          <Tooltip key={`spaceSwitcherItem_${s.id}`} content={s.label}>
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

      <CreateNewMenu>
        <CreateNewButton>
          <Icon icon={addCircleLine} />
        </CreateNewButton>
      </CreateNewMenu>
    </SpaceSwitcher>
  )
}
