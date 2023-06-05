import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSpring, useSprings } from 'react-spring'

import Tippy from '@tippyjs/react'
import { useGesture } from '@use-gesture/react'

import { TitleWithShortcut } from '@workduck-io/mex-components'

import { useLayoutStore } from '@mexit/core'
import { WDLogo } from '@mexit/shared'

import { getElementById } from '../../Utils/cs-utils'

import { Circle, DragIcon, ToggleWrapper, Wrapper } from './styled'

export const DraggableToggle = () => {
  const [isHovering, setIsHovering] = useState(false)
  const { rhSidebar, toggleRHSidebar, toggleTop, setToggleTop } = useLayoutStore()

  // TODO: Not using this for now, was having issues with calc() inside api.start()
  // const { endColumnWidth } = useSidebarTransition()

  const avatarRefs = useRef<HTMLDivElement[]>([])
  const avatarRefInitialPositions = useRef<number[]>([])
  const toggleRef = useRef<HTMLDivElement>(null)
  const avatarTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const [{ x, y }, api] = useSpring(() => ({ x: '97vw', y: toggleTop }), [])
  const [buttonSprings, buttonApi] = useSprings(3, (i) => ({ y: 0 }), [])

  const bind = useGesture(
    {
      onDrag: ({ offset: [, y] }) => {
        api.start({ y })
      },
      onDragEnd: () => {
        setToggleTop(y.get())
      },
      onHover: ({ hovering }) => {
        setIsHovering(hovering)

        if (hovering) {
          if (avatarTimeoutRef.current) {
            clearTimeout(avatarTimeoutRef.current)
          }

          buttonApi.start({
            y: 0
          })
        } else {
          avatarTimeoutRef.current = setTimeout(() => {
            buttonApi.start((i) => ({
              y: avatarRefInitialPositions.current[i]
            }))
          }, 1500)
        }
      },
      onClick: () => {
        toggleRHSidebar()
      }
    },
    {
      drag: {
        from: () => [0, y.get()],
        axis: 'y',
        // filters click events when dragging
        filterTaps: true,
        pointer: {
          keys: false
        }
      }
    }
  )

  useLayoutEffect(() => {
    if (avatarRefInitialPositions.current.length === 0) {
      const { y: buttonY } = toggleRef.current.getBoundingClientRect()

      avatarRefInitialPositions.current = avatarRefs.current.map((node) => buttonY - node.getBoundingClientRect().y)
    }

    buttonApi.start((i) => ({
      y: avatarRefInitialPositions.current[i],
      immediate: true
    }))
  }, [])

  useEffect(() => {
    api.start({ x: rhSidebar.expanded ? '62vw' : '96vw' })
  }, [rhSidebar.expanded])

  return (
    <ToggleWrapper ref={toggleRef} {...bind()} style={{ x, y }}>
      <Tippy
        theme="mex-bright"
        placement="left"
        appendTo={() => getElementById('ext-side-nav')}
        content={<TitleWithShortcut title={rhSidebar.expanded ? 'Collapse Sidebar' : 'Expand Sidebar'} />}
      >
        <Wrapper>
          <WDLogo />
          <DragIcon $show={isHovering} icon="ic:outline-drag-indicator" />
        </Wrapper>
      </Tippy>

      {buttonSprings.map((springs, index) => (
        <Circle key={index} ref={(ref) => (avatarRefs.current[index] = ref!)} style={springs} />
      ))}
    </ToggleWrapper>
  )
}
