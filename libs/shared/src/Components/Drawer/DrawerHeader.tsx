import React from 'react'

import { useLayoutStore } from '@mexit/core'

import { Group, MexIcon } from '../../Style/Layouts'
import { DefaultMIcons } from '../Icons'

import { DrawerHeaderContainer, DrawerHeaderDesc } from './styled'

type DrawerHeaderProps = {
  title: string
  showBackButton?: boolean
  description?: string
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({ title, showBackButton, description }) => {
  const closeDrawer = useLayoutStore((store) => store.setDrawer)

  const handleCloseDrawer = () => {
    closeDrawer()
  }

  return (
    <DrawerHeaderContainer>
      <Group>
        {showBackButton && <MexIcon cursor="pointer" fontSize={20} height={20} width={20} icon="ri:arrow-left-line" />}
        <div>
          <h3>{title}</h3>
          <DrawerHeaderDesc>{description}</DrawerHeaderDesc>
        </div>
      </Group>
      <MexIcon
        cursor="pointer"
        icon={DefaultMIcons.CLEAR.value}
        fontSize={20}
        height={20}
        width={20}
        onClick={handleCloseDrawer}
      />
    </DrawerHeaderContainer>
  )
}
