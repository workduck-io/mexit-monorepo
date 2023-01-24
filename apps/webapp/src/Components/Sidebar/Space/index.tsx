import React, { CSSProperties } from 'react'

import { AnimatedProps } from '@react-spring/web'

import { SingleSpace } from '../Sidebar.style'
import { MexTree } from '../Sidebar.tree'
import { SidebarSpace } from '../Sidebar.types'

import Header from './header'

interface SidebarSpaceProps {
  space: SidebarSpace
  style: CSSProperties
  readOnly?: boolean
  hideShare?: boolean
}

export const SidebarSpaceComponent = ({ space, style, readOnly, hideShare }: AnimatedProps<SidebarSpaceProps>) => {
  console.log('SPACE IS', { space })
  return (
    <SingleSpace style={style}>
      <Header space={space} readOnly={readOnly as boolean} hideShareSpace={hideShare} />
      {
        {
          hierarchy: space?.list?.type === 'hierarchy' && (
            <MexTree
              items={space?.list?.items}
              readOnly={space?.data?.access === 'READ'}
              spaceId={space?.id}
              filterText="Filter Notes"
            />
          ),
          flat: space?.list?.type === 'flat' && <space.list.renderItems />
        }[space?.list?.type]
      }
    </SingleSpace>
  )
}
