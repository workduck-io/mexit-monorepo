import React, { useEffect, useMemo, useState } from 'react'

import { useTransition, useSpringRef } from '@react-spring/web'

import { SharedNodeIconify } from '@mexit/shared'

import { usePolling } from '../../Hooks/API/usePolling'
import { useTags } from '../../Hooks/useTags'
import { useApiStore, PollActions } from '../../Stores/useApiStore'
import { useDataStore } from '../../Stores/useDataStore'
import SharedNotes from './SharedNotes'
import { SidebarSpaceComponent } from './Sidebar.space'
import { SidebarSpaceSwitcher } from './Sidebar.spaceSwitcher'
import { SpaceContentWrapper, SpaceWrapper } from './Sidebar.style'
import { SidebarSpace } from './Sidebar.types'
import StarredNotes from './StarredNotes'

export const NoteSidebar = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const [index, setIndex] = useState({ current: 0, prev: -1 })
  const { getMostUsedTags } = useTags()
  const tags = useDataStore((s) => s.tags)
  const replaceAndAddActionToPoll = useApiStore((store) => store.replaceAndAddActionToPoll)
  // Required to find direction of the animation
  // const { getAllBookmarks } = useBookmarks()
  //
  const changeIndex = (newIndex: number) => {
    if (newIndex === index.current) return
    setIndex((s) => ({ current: newIndex, prev: s.current }))
  }

  const mostUsedTags = useMemo(() => {
    const topUsedTags = getMostUsedTags()
      .sort((a, b) => a.freq - b.freq)
      .reverse()
      .slice(0, 5)
      .map((t) => ({ value: t.tag }))
    // mog('AllTag', { allTagFreq })
    return topUsedTags
  }, [tags])

  const spaces: Array<SidebarSpace> = useMemo(
    () => [
      {
        id: 'personal',
        label: 'Personal',
        icon: 'ri:user-line',
        tooltip: 'All Notes',
        list: {
          type: 'hierarchy',
          items: ilinks
        },
        popularTags: mostUsedTags,
        pinnedItems: () => <StarredNotes />,
        pollAction: PollActions.hierarchy
      },
      {
        id: 'shared',
        label: 'Shared Notes',
        tooltip: 'Shared Notes',
        icon: SharedNodeIconify,
        list: {
          type: 'flat',
          renderItems: () => <SharedNotes />
        },
        pollAction: PollActions.shared
      }
    ],
    [ilinks]
  )

  const currentSpace = spaces[index.current]
  // const onClick = useCallback(() => set(state => (state + 1) % 3), [])
  const transRef = useSpringRef()
  const transitions = useTransition(index, {
    ref: transRef,
    keys: null,
    from: (item) => {
      // console.log({ item })
      const direction = item.prev > -1 ? Math.sign(item.current - item.prev) : -1
      return { opacity: 0, transform: `translate3d(${direction * 100}%,0,0)` }
    },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: (item) => {
      // console.log({ item })
      const direction = item.prev > -1 ? Math.sign(item.current - item.prev) : -1
      return { opacity: 0, transform: `translate3d(${direction * 100}%,0,0)` }
    }
  })

  usePolling()

  useEffect(() => {
    transRef.start()
  }, [index])

  useEffect(() => {
    if (currentSpace.pollAction) {
      replaceAndAddActionToPoll(currentSpace.pollAction)
    }
  }, [currentSpace])

  return (
    <SpaceWrapper>
      <SpaceContentWrapper>
        {transitions((style, i) => {
          return <SidebarSpaceComponent space={spaces[i.current]} style={style} />
        })}
      </SpaceContentWrapper>
      {/* currentSpace && <SidebarSpaceComponent style={} space={currentSpace} />*/}
      <SidebarSpaceSwitcher currentSpace={currentSpace.id} spaces={spaces} setCurrentIndex={changeIndex} />
    </SpaceWrapper>
  )
}
