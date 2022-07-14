import React, { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import CloseIcon from '@iconify/icons-ri/close-line'
import QuestionMarkIcon from '@iconify/icons-ri/question-mark'
import externalLinkLine from '@iconify/icons-ri/external-link-line'
import { transparentize } from 'polished'
import { Icon } from '@iconify/react'

import { FOCUS_MODE_OPACITY } from '@mexit/core'
import { FocusModeProp, Button, MexIcon } from '@mexit/shared'

import { useLayoutStore } from '../Stores/useLayoutStore'
import { Float, FlexBetween, ClickableIcon, MenuItem } from './FloatingButton'
import { animated, useSpring } from 'react-spring'

interface PublicNodeFloatingButtonProps {
  firstVisit: boolean
}

const FloatButton = styled(Button)`
  border-radius: 50%;
  cursor: pointer;
  padding: 0.8rem;
  position: absolute;
  right: 3.5rem;
  bottom: 1rem;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const FloatingMenuHeader = styled(animated.div)<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  flex-direction: row;
  justify-content: space-between;
  white-space: nowrap;
  background-color: ${({ theme }) => theme.colors.gray[9]};

  color: ${({ theme }) => transparentize(0.22, theme.colors.text.oppositePrimary)};
  position: absolute;

  padding: 1rem 4rem;
  text-align: left;
  border-radius: 5px;
`

const FloatingMenu = styled(animated.div)`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.background.modal};

  min-width: 250px;

  overflow: hidden;

  position: relative;
  top: -1rem;
  right: 7.5rem;

  border-radius: 5px;
  white-space: nowrap;
`

const HorizontalRule = styled.div`
  margin: 1rem -1rem;

  background-color: #d9d9d9;
  opacity: 0.1;
  content: ' ';
  height: 1px;
`

const FloatingButton = styled(FloatButton)<{ visible: boolean }>`
  height: 3.2rem;
  cursor: pointer;
  width: 3.2rem;

  ${FloatingMenuHeader} {
    display: ${({ visible }) => !visible && 'none'};
  }

  :hover {
    ${FloatingMenuHeader} {
      display: ${({ visible }) => !visible && 'block'};
    }
  }
`

const ConnectButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;

  &:hover {
    color: #fff;
  }
`

const Link = styled.a`
  color: #fff;
  opacity: 0.5;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    opacity: 1;
  }
`

const PublicNodeFloatingButton = ({ firstVisit }: PublicNodeFloatingButtonProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false)

  const focusMode = useLayoutStore((store) => store.focusMode)

  const openCalendlyLink = () => {
    window.open('https://google.com', '_blank')
  }

  useEffect(() => {
    let clearFirstVisit: NodeJS.Timeout
    if (firstVisit) {
      clearFirstVisit = setTimeout(() => {
        if (!showMenu) setShowMenu(true)
      }, 1000)
    }

    return () => {
      if (clearFirstVisit) clearTimeout(clearFirstVisit)
    }
  }, [firstVisit])

  const menuProps = useSpring(
    useMemo(() => {
      const style = { height: '0', padding: '0' }

      if (showMenu) {
        style.height = '100%'
        style.padding = '1rem'
      }

      return style
    }, [showMenu])
  )

  const headerProps = useSpring(
    useMemo(() => {
      const style = {
        top: '-3.5rem',
        right: '3.85rem'
      }

      if (showMenu) {
        style.top = '-8rem'
      }

      return style
    }, [showMenu])
  )

  return (
    <Float $focusMode={focusMode.on}>
      <FloatingButton
        id="wd-mex-floating-button"
        key="wd-mex-floating-button"
        onClick={() => setShowMenu(!showMenu)}
        visible={showMenu}
      >
        <Icon icon={QuestionMarkIcon} />

        <FloatingMenuHeader visible={showMenu} style={headerProps}>
          Connect with us
        </FloatingMenuHeader>
      </FloatingButton>

      {/* @ts-ignore */}
      <FloatingMenu style={menuProps}>
        <ConnectButton onClick={openCalendlyLink}>Calendly Link</ConnectButton>

        <HorizontalRule> </HorizontalRule>
        <Link href="https://workduck.io" target="__blank">
          <Icon icon={externalLinkLine} />
          Visit workduck.io{' '}
        </Link>
      </FloatingMenu>
    </Float>
  )
}

export default PublicNodeFloatingButton
