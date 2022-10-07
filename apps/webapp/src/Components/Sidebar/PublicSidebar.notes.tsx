import React, { useEffect, useMemo, useState, useRef } from 'react'

import { useTransition, useSpringRef } from '@react-spring/web'

import { RESERVED_NAMESPACES, mog, ILink, SingleNamespace } from '@mexit/core'
import { SharedNodeIconify } from '@mexit/shared'

import { usePolling } from '../../Hooks/API/usePolling'
import { useNamespaces } from '../../Hooks/useNamespaces'
import { useTags } from '../../Hooks/useTags'
import { useApiStore, PollActions } from '../../Stores/useApiStore'
import { useDataStore } from '../../Stores/useDataStore'
import { usePublicNodeStore } from '../../Stores/usePublicNodes'
import { useUserPreferenceStore } from '../../Stores/userPreferenceStore'
import PublicNodeView from '../../Views/PublicNodeView'
import SharedNotes from './SharedNotes'
import { SidebarSpaceSwitcher } from './Sidebar.spaceSwitcher'
import { SpaceContentWrapper, SpaceWrapper } from './Sidebar.style'
import { SidebarSpace } from './Sidebar.types'
import { SidebarSpaceComponent } from './Space'

export const PublicNoteSidebar = () => {
  const ns = usePublicNodeStore((state) => state.namespace)
  const iLinks = usePublicNodeStore((state) => state.iLinks)

  const space: SidebarSpace = useMemo(() => {
    const namespaceIlinks = iLinks?.filter((item) => item?.namespace === ns?.id)
    mog('ILinks', { iLinks, namespaceIlinks, ns })

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
      pollAction: PollActions.hierarchy
    } as SidebarSpace
  }, [iLinks, ns])

  const defaultStyles = { opacity: 1, transform: 'translate3d(0%,0,0)' }

  return (
    <SpaceWrapper>
      <SpaceContentWrapper>
        <SidebarSpaceComponent space={space} style={defaultStyles} />
      </SpaceContentWrapper>
      {/* <SidebarSpaceSwitcher currentSpace={currentSpace?.id} spaces={spaces} setCurrentIndex={changeIndex} /> */}
    </SpaceWrapper>
  )
}
