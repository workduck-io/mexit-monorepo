import { useMemo } from 'react'

import { PollActions, usePublicNodeStore } from '@mexit/core'

import { SidebarWrapper, SpaceContentWrapper } from './Sidebar.style'
import { SidebarSpace } from './Sidebar.types'
import { SidebarSpaceComponent } from './Space'

export const PublicNoteSidebar = () => {
  const ns = usePublicNodeStore((state) => state.namespace)
  const iLinks = usePublicNodeStore((state) => state.iLinks)

  const space: SidebarSpace = useMemo(() => {
    // const namespaceIlinks = iLinks?.filter((item) => item?.namespace === ns?.id)
    if (ns)
      return {
        id: ns.id,
        label: ns.name,
        icon: ns.icon ?? {
          type: 'ICON',
          value: 'heroicons-outline:view-grid'
        },
        tooltip: ns.name,
        list: {
          type: 'hierarchy',
          items: iLinks
        },
        data: ns,
        pollAction: PollActions.hierarchy
      } as SidebarSpace
  }, [iLinks, ns])

  const defaultStyles = { opacity: 1, transform: 'translate3d(0%,0,0)' }

  return (
    <SidebarWrapper>
      <SpaceContentWrapper>
        <SidebarSpaceComponent key={ns?.id} space={space} style={defaultStyles} readOnly={true} />
      </SpaceContentWrapper>
      {/* <SidebarSpaceSwitcher currentSpace={currentSpace?.id} spaces={spaces} setCurrentIndex={changeIndex} /> */}
    </SidebarWrapper>
  )
}
