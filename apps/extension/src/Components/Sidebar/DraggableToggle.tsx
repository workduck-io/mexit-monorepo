import React, { useEffect, useRef, useState } from 'react'

import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react'
import { useHoverIntent } from 'react-use-hoverintent'
import styled, { css } from 'styled-components'

import { TitleWithShortcut } from '@workduck-io/mex-components'

import { mog } from '@mexit/core'

import { useSidebarTransition } from '../../Hooks/useSidebarTransition'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { getElementById } from '../../contentScript'

const ToggleWrapper = styled.div<{ $expanded?: boolean; $top: number }>`
  position: fixed;
  display: flex;
  align-items: center;

  ${({ $expanded, $top, theme }) =>
    $expanded
      ? css`
          top: ${$top}px;
          right: calc(${'400px' + ' + ' + (theme.additional.hasBlocks ? 0 : -15)}px);
        `
      : css`
          top: ${$top}px;
          right: ${theme.additional.hasBlocks ? 8 : 8}px;
        `}

  z-index: 9999999999;
  padding: 8px;
  border-radius: 100%;
  background: ${({ theme }) => theme.colors.background.sidebar};
  color: ${({ theme }) => theme.colors.text.fade};

  svg {
    height: 16px;
    width: 16px;
  }

  &:hover {
    cursor: pointer;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.25);
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }

  &:active {
    transition: background 0.1s ease;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }
`

export const DraggableToggle = () => {
  const [isHovering, intentRef, setIsHovering] = useHoverIntent({ timeout: 250 })
  const [tracking, setTracking] = useState(false)
  const { rhSidebar, toggleRHSidebar, toggleTop, setToggleTop } = useLayoutStore()
  const { endColumnWidth } = useSidebarTransition()

  const handleRef = useRef<any>(null)

  useEffect(() => {
    const handleMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
      setTracking(true)
    }

    if (handleRef?.current) {
      mog('attaching event listener')
      handleRef.current.addEventListener('mousedown', handleMouseDown)
    }

    return () => {
      handleRef?.current?.removeEventListener('mousedown', handleMouseDown)
    }
  }, [handleRef?.current])

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (tracking) {
        const newHeight = event.screenY
        // mog('height', { newHeight })
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
      <ToggleWrapper ref={intentRef as any} $top={toggleTop} $expanded={rhSidebar.expanded} onClick={toggleRHSidebar}>
        <Icon
          icon={rhSidebar.expanded ? 'heroicons-solid:chevron-double-right' : 'heroicons-solid:chevron-double-left'}
        />

        <Icon ref={handleRef} icon="ic:outline-drag-indicator" />
      </ToggleWrapper>
    </Tippy>
  )
}
