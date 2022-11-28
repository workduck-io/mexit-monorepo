import React, { useEffect, useRef, useState } from 'react'

import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react'
import { useHoverIntent } from 'react-use-hoverintent'
import styled, { css } from 'styled-components'

import { TitleWithShortcut } from '@workduck-io/mex-components'

import { WDLogo } from '@mexit/shared'

import { useSidebarTransition } from '../../Hooks/useSidebarTransition'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { getElementById } from '../../contentScript'

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

const ToggleWrapper = styled.div<{ $endColumnWidth?: string; $expanded?: boolean; $top: number }>`
  position: fixed;
  display: flex;
  align-items: center;
  width: max-content;

  ${({ $expanded, $top, $endColumnWidth, theme }) =>
    $expanded
      ? css`
          top: ${$top}px;
          right: calc(${($endColumnWidth ?? '400px') + ' + ' + (theme.additional.hasBlocks ? 0 : -15)}px);
        `
      : css`
          top: ${$top}px;
          right: 8px;
        `}

  z-index: 9999999999;
  padding: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.background.sidebar};
  color: ${({ theme }) => theme.colors.text.fade};
  transition: right 0.2s ease-in-out, background 0.2s ease-in-out, width 0.2s ease-in-out;

  svg {
    height: 16px;
    width: 16px;
  }

  &:hover {
    cursor: pointer;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.25);
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};

    svg {
      path {
        fill: ${({ theme }) => theme.colors.background.sidebar};
      }
    }
  }

  ${DragIcon} {
    cursor: ns-resize;
  }

  &:active {
    transition: background 0.1s ease;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }
`

export const DraggableToggle = () => {
  const [isHovering, intentRef, setIsHovering] = useHoverIntent({ timeout: 500 })
  const [tracking, setTracking] = useState(false)
  const { rhSidebar, toggleRHSidebar, toggleTop, setToggleTop } = useLayoutStore()
  const { endColumnWidth } = useSidebarTransition()

  const handleRef = useRef<any>(null)

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      setTracking(true)
    }

    if (handleRef?.current) {
      handleRef.current.addEventListener('mousedown', handleMouseDown)
    }

    return () => {
      handleRef?.current?.removeEventListener('mousedown', handleMouseDown)
    }
  }, [handleRef?.current])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (tracking) {
        const newHeight = event.clientY
        setToggleTop(newHeight)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [tracking])

  useEffect(() => {
    const handleMouseUp = (event) => {
      if (tracking) setTracking(false)
    }
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [tracking])

  return (
    <Tippy
      theme="mex-bright"
      placement="left"
      appendTo={() => getElementById('ext-side-nav')}
      content={<TitleWithShortcut title={rhSidebar.expanded ? 'Collapse Sidebar' : 'Expand Sidebar'} />}
    >
      <ToggleWrapper
        $endColumnWidth={endColumnWidth}
        ref={intentRef as any}
        $top={toggleTop}
        $expanded={rhSidebar.expanded}
        onClick={toggleRHSidebar}
      >
        <WDLogo />
        <DragIcon ref={handleRef} $show={isHovering} icon="ic:outline-drag-indicator" />
      </ToggleWrapper>
    </Tippy>
  )
}
