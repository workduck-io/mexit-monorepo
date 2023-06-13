import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSpring, useSprings } from 'react-spring'

import Tippy from '@tippyjs/react'
import { useGesture } from '@use-gesture/react'

import { TitleWithShortcut } from '@workduck-io/mex-components'

import { useLayoutStore } from '@mexit/core'
import { WDLogo } from '@mexit/shared'

import { getElementById } from '../../Utils/cs-utils'

import { ShortenerComponent } from './ShortenerComponent'
import { ButtonWrapper, DragIcon, ToggleWrapper, Wrapper } from './styled'

// Change this if more buttons have to be added
const FLOATING_BUTTONS = 1

export const DraggableToggle = () => {
  const [isHovering, setIsHovering] = useState(false)
  const [editable, setEditable] = useState(false)
  const { rhSidebar, toggleRHSidebar, toggleTop, setToggleTop } = useLayoutStore()

  const avatarRefs = useRef<HTMLDivElement[]>([])
  const avatarRefInitialPositions = useRef<number[]>([])
  const toggleRef = useRef<HTMLDivElement>(null)
  const avatarTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const [{ top, right }, api] = useSpring(() => ({ top: toggleTop, right: 0 }), [])
  const [buttonSprings, buttonApi] = useSprings(FLOATING_BUTTONS, (i) => ({ y: 0 }), [])

  const bind = useGesture(
    {
      onDrag: ({ offset: [, y] }) => {
        api.start({ top: y })
      },
      onDragEnd: () => {
        setToggleTop(top.get())
      },
      onHover: ({ hovering }) => {
        setIsHovering(hovering)
      }
    },
    {
      drag: {
        from: () => [0, top.get()],
        axis: 'y',
        // filters click events when dragging
        filterTaps: true,
        pointer: {
          keys: false
        },
        // Hard coding lower bound for now but would have to change if more buttons are added
        bounds: {
          top: 0,
          bottom: window.innerHeight - 100
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
    api.start({ right: rhSidebar.expanded ? 385 : 0 })
  }, [rhSidebar.expanded])

  useEffect(() => {
    if (isHovering || editable) {
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
  }, [isHovering, editable])
  return (
    <ToggleWrapper ref={toggleRef} {...bind()} style={{ top, right }}>
      <Tippy
        theme="mex-bright"
        placement="left"
        appendTo={() => getElementById('ext-side-nav')}
        content={<TitleWithShortcut title={rhSidebar.expanded ? 'Collapse Sidebar' : 'Expand Sidebar'} />}
      >
        <Wrapper onClick={() => toggleRHSidebar()}>
          <WDLogo />
          <DragIcon $show={isHovering} icon="ic:outline-drag-indicator" />
        </Wrapper>
      </Tippy>

      <ButtonWrapper ref={(ref) => (avatarRefs.current[0] = ref!)} style={buttonSprings[0]}>
        <ShortenerComponent editable={editable} setEditable={setEditable} />
      </ButtonWrapper>
    </ToggleWrapper>
  )
}
