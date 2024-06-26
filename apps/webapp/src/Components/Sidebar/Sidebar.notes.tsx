import React, { useEffect, useMemo, useRef, useState } from 'react'

import { useSpringRef, useTransition } from '@react-spring/web'

import {
  ContextMenuType,
  PollActions,
  RecentType,
  RESERVED_NAMESPACES,
  SHARED_NAMESPACE,
  useApiStore,
  useDataStore,
  useRecentsStore,
  userPreferenceStore as useUserPreferenceStore
} from '@mexit/core'
import { getMIcon } from '@mexit/shared'

import { getNextWrappingIndex } from '../../Editor/Utils/getNextWrappingIndex'
import { usePolling } from '../../Hooks/API/usePolling'
import { useCreateNewMenu } from '../../Hooks/useCreateNewMenu'
import { useNamespaces } from '../../Hooks/useNamespaces'
import { useTags } from '../../Hooks/useTags'

import SharedNotes from './SharedNotes'
import { SidebarSpaceSwitcher } from './Sidebar.spaceSwitcher'
import { SpaceContentWrapper, SpaceWrapper } from './Sidebar.style'
import { SidebarSpace } from './Sidebar.types'
import { SidebarSpaceComponent } from './Space'
import StarredNotes from './StarredNotes'

export const NoteSidebar = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const namespaces = useDataStore((store) => store.namespaces)
  const baseNodeId = useDataStore((store) => store.baseNodeId)
  const lastOpened = useRecentsStore((store) => store.lastOpened)
  const addRecent = useRecentsStore((store) => store.addRecent)
  const setpreferenceModifiedAtAndLastOpened = useUserPreferenceStore(
    (store) => store.setpreferenceModifiedAtAndLastOpened
  )

  if (!lastOpened?.notes?.includes(baseNodeId)) {
    addRecent(RecentType.notes, baseNodeId)
    setpreferenceModifiedAtAndLastOpened(Date.now(), useRecentsStore.getState().lastOpened)
  }

  const spaceId = useUserPreferenceStore((store) => store.activeNamespace)
  const changeSidebarSpace = useUserPreferenceStore((store) => store.setActiveNamespace)
  const { getMostUsedTags } = useTags()
  const tags = useDataStore((s) => s.tags)
  const _hasHydrated = useDataStore((s) => s._hasHydrated)
  const replaceAndAddActionToPoll = useApiStore((store) => store.replaceAndAddActionToPoll)
  const { getNodesByNamespaces, getNamespaceOfNodeid } = useNamespaces()
  const isAnimate = useRef(false)

  const mostUsedTags = useMemo(() => {
    const topUsedTags = getMostUsedTags()
    return topUsedTags
  }, [tags])

  const { handleCreateNote } = useCreateNewMenu()

  const spaces: Array<SidebarSpace> = useMemo(() => {
    const nodesByNamespaces = getNodesByNamespaces()
    const nspaces = nodesByNamespaces
      .sort((a, b) => a.createdAt - b.createdAt)
      .sort((a, b) => {
        // if granter id is present, move to end
        if (a.granterID) return 1
        if (b.granterID) return -1
        return 0
      })
      .map((ns) => {
        return {
          id: ns.id,
          label: ns.name,
          icon:
            ns.icon ??
            getMIcon('ICON', ns.name === RESERVED_NAMESPACES.default ? 'ri:user-line' : 'heroicons-outline:view-grid'),
          data: ns,
          tooltip: ns.name,
          list: {
            type: 'hierarchy',
            items: ns.nodes
          },
          popularTags: mostUsedTags[ns.id] ?? undefined,
          pinnedItems: () => <StarredNotes />,
          pollAction: PollActions.hierarchy
        } as SidebarSpace
      })

    // .slice(0, 5)
    // Add shared notes namespace
    nspaces.push({
      id: 'NAMESPACE_shared',
      label: RESERVED_NAMESPACES.shared,
      tooltip: 'Shared Notes',
      icon: getMIcon('ICON', 'mex:shared-note'),
      data: SHARED_NAMESPACE,
      list: {
        type: 'flat',
        renderItems: () => <SharedNotes />
      },
      pollAction: PollActions.shared
    })

    return nspaces
  }, [ilinks, namespaces])

  const [index, setIndex] = useState({
    current: -1,
    // Required to find direction of the animation
    prev: -1
  })

  const changeIndex = (newIndex: number, updateStores = true) => {
    if (newIndex === index.current) return
    const nextSpaceId = spaces[newIndex]?.id
    // mog('Changing index', { newIndex, index })
    if (nextSpaceId) {
      if (updateStores) {
        changeSidebarSpace(nextSpaceId)
        isAnimate.current = true
      } else {
        isAnimate.current = false
      }
      setIndex({ current: newIndex, prev: index.current })
    }
  }

  const setNextSpaceIndex = (reverse = false) => {
    const at = index.current
    const nextIndex = getNextWrappingIndex(reverse ? -1 : 1, at, spaces.length, () => undefined, false)
    changeIndex(nextIndex)
  }

  useEffect(() => {
    if (_hasHydrated) {
      const getIndex = () => {
        const index = spaces?.findIndex((space) => space.id === spaceId ?? getNamespaceOfNodeid(baseNodeId)?.id)
        return index < 0 ? 0 : index
      }
      const newIndex = getIndex()

      changeIndex(newIndex, false)
    }
  }, [_hasHydrated, spaceId])

  const currentSpace = useMemo(() => {
    if (_hasHydrated && index.current > -1) return spaces[index.current]
  }, [_hasHydrated, index.current, spaces])

  const transRef = useSpringRef()
  const defaultStyles = { opacity: 1, transform: 'translate3d(0%,0,0)' }
  const fadeStyles = { opacity: 1, transform: 'translate3d(0%,0,0)' }
  const transitions = useTransition(index, {
    ref: transRef,
    keys: null,
    from: () => {
      // Skip if there is no previous index
      if (index.prev === -1) return defaultStyles
      if (!isAnimate.current) return fadeStyles
      const direction = index.prev > -1 ? Math.sign(index.current - index.prev) : 1
      // mog('from', { index, direction })
      return { opacity: 0, transform: `translate3d(${direction * 100}%,0,0)` }
    },
    enter: defaultStyles,
    leave: () => {
      // Skip if there is no previous index
      if (index.prev === -1) return defaultStyles
      if (!isAnimate.current) return fadeStyles
      const direction = index.prev > -1 ? -Math.sign(index.current - index.prev) : -1
      // mog('leave', { index, direction })
      return { opacity: 0, transform: `translate3d(${direction * 100}%,0,0)` }
    }
  })

  /**
   * Set initial namespace when not in preference
   */
  useEffect(() => {
    const currentNamespace = useUserPreferenceStore.getState().activeNamespace
    const selectedSpace = spaces?.[index.current]?.id

    if (!currentNamespace) {
      if (selectedSpace && selectedSpace !== spaceId) {
        changeSidebarSpace(selectedSpace)
      }
      useUserPreferenceStore.getState().setActiveNamespace(selectedSpace)
    }
  }, [spaces, spaceId])

  usePolling()

  useEffect(() => {
    transRef.start()
  }, [index])

  useEffect(() => {
    if (currentSpace?.pollAction) {
      replaceAndAddActionToPoll(currentSpace.pollAction)
    }
  }, [currentSpace])

  const isReadOnly = currentSpace?.data?.access === 'READ'
  const isSharedSpace = currentSpace?.data?.name === RESERVED_NAMESPACES.shared

  const tooltipMessage = isReadOnly ? 'You have read only access' : 'New Note'

  return (
    <SpaceWrapper>
      <SpaceContentWrapper>
        {transitions((style, i) => {
          return <SidebarSpaceComponent space={spaces[i.current]} style={style} />
        })}
      </SpaceContentWrapper>
      <SidebarSpaceSwitcher
        contextMenuType={ContextMenuType.NOTE_NAMESPACE}
        isCreateDisabled={isReadOnly || isSharedSpace}
        toolTip={isSharedSpace ? 'Cannot create notes in shared Space' : tooltipMessage}
        onCreateNew={() => handleCreateNote(currentSpace?.id)}
        currentSpace={currentSpace?.id}
        spaces={spaces}
        setCurrentIndex={changeIndex}
        setNextSpaceIndex={setNextSpaceIndex}
      />
    </SpaceWrapper>
  )
}
