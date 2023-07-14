/* eslint-disable react/display-name */
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { useSpringRef, useTransition } from '@react-spring/web'

import { RESERVED_SNIPPET_SPACES, SNIPPET_VIEW_NAMESPACES } from '@mexit/core'

import { getNextWrappingIndex } from '../../Editor/Utils/getNextWrappingIndex'
import { useCreateNewMenu } from '../../Hooks/useCreateNewMenu'

import PromptList from './PromptList'
import { SidebarSpaceSwitcher } from './Sidebar.spaceSwitcher'
import { SpaceContentWrapper, SpaceWrapper } from './Sidebar.style'
import { SidebarSpace } from './Sidebar.types'
import SnippetList from './SnippetList'
import { SidebarSpaceComponent } from './Space'

const getRenderItem = (itemName: string) => {
  switch (itemName) {
    case 'Snippets':
      return () => <SnippetList type={'snippet'} />
    case 'Templates':
      return () => <SnippetList type={'template'} />
    default:
      return () => <PromptList />
  }
}

export const CapturesSidebar = () => {
  const isAnimate = useRef(false)

  const { handleCreateSnippet } = useCreateNewMenu()

  const spaces: Array<SidebarSpace> = useMemo(() => {
    return SNIPPET_VIEW_NAMESPACES.map((ns) => {
      return {
        id: ns.id,
        label: ns.name,
        icon: ns.icon,
        data: ns,
        tooltip: ns.name,
        list: {
          type: 'flat',
          renderItems: getRenderItem(ns.name)
        }
      } as SidebarSpace
    })
  }, [])

  const [index, setIndex] = useState({
    current: 0,
    // Required to find direction of the animation
    prev: -1
  })

  const changeIndex = (newIndex: number, updateStores = true) => {
    if (newIndex === index.current) return
    const nextSpaceId = spaces[newIndex]?.id
    // mog('Changing index', { newIndex, index })
    if (nextSpaceId) {
      if (updateStores) {
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

  const currentSpace = spaces[index.current]
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

  useEffect(() => {
    transRef.start()
  }, [index])

  const isCreateDisabled = currentSpace?.id === RESERVED_SNIPPET_SPACES.prompts

  const toolTipMessage = isCreateDisabled ? 'Create Prompts (Coming Soon)' : 'Create Snippet'

  return (
    <SpaceWrapper>
      <SpaceContentWrapper>
        {transitions((style, i) => {
          return <SidebarSpaceComponent space={spaces[i.current]} style={style} readOnly hideShare />
        })}
      </SpaceContentWrapper>
      <SidebarSpaceSwitcher
        isCreateDisabled={isCreateDisabled}
        toolTip={currentSpace?.id === RESERVED_SNIPPET_SPACES.templates ? 'Create Template' : toolTipMessage}
        onCreateNew={() => handleCreateSnippet(currentSpace?.id === RESERVED_SNIPPET_SPACES.templates)}
        currentSpace={currentSpace?.id}
        spaces={spaces}
        setCurrentIndex={changeIndex}
        setNextSpaceIndex={setNextSpaceIndex}
      />
    </SpaceWrapper>
  )
}
