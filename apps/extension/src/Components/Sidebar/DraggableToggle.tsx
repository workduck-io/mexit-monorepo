import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'

import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react'
import { useGesture } from '@use-gesture/react'
import styled, { css } from 'styled-components'

import { TitleWithShortcut } from '@workduck-io/mex-components'

import { useLayoutStore } from '@mexit/core'
import { WDLogo } from '@mexit/shared'

import { getElementById } from '../../Utils/cs-utils'

const DragIcon = styled(Icon)<{ $show: boolean }>`
  margin-right: -18px;
  opacity: 0;
  pointer-events: none;
  transition: margin-right 0.2s ease-in-out, opacity 0.2s ease-in-out;
  ${(props) =>
    props.$show &&
    css`
      margin-right: 0;
      opacity: 1;
      pointer-events: all;
    `}
`

const ToggleWrapper = styled(animated.div)`
  display: flex;
  align-items: center;
  width: max-content;
  position: relative;

  z-index: 9999999999;
  padding: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.tokens.surfaces.sidebar};
  color: ${({ theme }) => theme.tokens.text.fade};
  transition: right 0.2s ease-in-out, background 0.2s ease-in-out, width 0.2s ease-in-out;

  svg {
    height: 16px;
    width: 16px;
  }

  &:hover,
  &:active {
    cursor: pointer;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.25);
    background: ${({ theme }) => theme.tokens.colors.primary.default};
    color: ${({ theme }) => theme.tokens.colors.primary.text};

    svg {
      path {
        fill: ${({ theme }) => theme.tokens.surfaces.sidebar};
      }
    }
  }

  ${DragIcon} {
    cursor: ns-resize;
  }

  &:active {
    transition: background 0.1s ease;
    background-color: ${({ theme }) => theme.tokens.colors.primary.default};
    color: ${({ theme }) => theme.tokens.colors.primary.text};
  }
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

export const DraggableToggle = () => {
  const [isHovering, setIsHovering] = useState(false)
  const { rhSidebar, toggleRHSidebar, toggleTop, setToggleTop } = useLayoutStore()

  // TODO: Not using this for now, was having issues with calc() inside api.start()
  // const { endColumnWidth } = useSidebarTransition()

  const handleRef = useRef<any>(null)

  const [{ x, y }, api] = useSpring(() => ({ x: '97vw', y: toggleTop }), [])

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

  useEffect(() => {
    api.start({ x: rhSidebar.expanded ? '63vw' : '97vw' })
  }, [rhSidebar.expanded])

  useEffect(() => {
    console.log('vertical', { y, toggleTop })
  }, [y, toggleTop])

  return (
    <Tippy
      theme="mex-bright"
      placement="left"
      appendTo={() => getElementById('ext-side-nav')}
      content={<TitleWithShortcut title={rhSidebar.expanded ? 'Collapse Sidebar' : 'Expand Sidebar'} />}
    >
      <ToggleWrapper {...bind()} style={{ x, y }}>
        <Wrapper>
          <WDLogo />
          <DragIcon ref={handleRef} $show={isHovering} icon="ic:outline-drag-indicator" />
        </Wrapper>
      </ToggleWrapper>
    </Tippy>
  )
}
