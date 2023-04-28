import React from 'react'

import { useLayoutStore } from '@mexit/core'

import { Group, MexIcon } from '../../Style/Layouts'
import { Loading } from '../../Style/Loading'
import { DefaultMIcons } from '../Icons'

import { DrawerHeaderContainer, DrawerHeaderDesc } from './styled'

type DrawerHeaderProps = {
  title: string
  showBackButton?: boolean
  description?: string
  isLoading?: boolean
  align?: 'start' | 'center'
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  title,
  showBackButton,
  description,
  isLoading,
  align = 'start'
}) => {
  const closeDrawer = useLayoutStore((store) => store.setDrawer)

  const handleCloseDrawer = () => {
    closeDrawer()
  }

  return (
    <DrawerHeaderContainer align={align}>
      <Group>
        {showBackButton && <MexIcon cursor="pointer" fontSize={20} height={20} width={20} icon="ri:arrow-left-line" />}
        <div>
          <h3>{title}</h3>
          <DrawerHeaderDesc>{description}</DrawerHeaderDesc>
        </div>
      </Group>
      {isLoading ? (
        <Loading dots={3} transparent />
      ) : (
        <MexIcon
          cursor="pointer"
          icon={DefaultMIcons.CLEAR.value}
          fontSize={20}
          height={20}
          width={20}
          onClick={handleCloseDrawer}
        />
      )}
    </DrawerHeaderContainer>
  )
}
