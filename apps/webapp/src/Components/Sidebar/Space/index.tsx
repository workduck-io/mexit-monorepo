import React, { CSSProperties } from 'react'

import { AnimatedProps } from '@react-spring/web'

import { SingleSpace, SpaceSeparator } from '../Sidebar.style'
import { MexTree } from '../Sidebar.tree'
import { SidebarSpace } from '../Sidebar.types'
import Header from './header'

interface SidebarSpaceProps {
  space: SidebarSpace
  style: CSSProperties
}

export const SidebarSpaceComponent = ({ space, style }: AnimatedProps<SidebarSpaceProps>) => {
  return (
    <SingleSpace style={style}>
      <Header space={space} />
      {
        {
          hierarchy: space?.list?.type === 'hierarchy' && (
            <MexTree items={space?.list?.items} spaceId={space?.id} filterText="Filter Notes" />
          ),
          flat: space?.list?.type === 'flat' && <space.list.renderItems />
        }[space?.list?.type]
      }
    </SingleSpace>
  )
}
