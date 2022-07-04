import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import Tippy from '@tippyjs/react'
import CloseIcon from '@iconify/icons-ri/close-line'
import QuestionMarkIcon from '@iconify/icons-ri/question-mark'
import { Icon } from '@iconify/react'

import { FOCUS_MODE_OPACITY } from '@mexit/core'
import { FocusModeProp, Button, MexIcon } from '@mexit/shared'

import { useAuthStore } from '../Stores/useAuth'
import { useHelpStore } from '../Stores/useHelpStore'
import { useLayoutStore } from '../Stores/useLayoutStore'
import { useGameStore } from '../Stores/useGameStore'
import AutoformatHelp from './Autoformathelp'
import { useLocation } from 'react-router-dom'

export const Float = styled.div<FocusModeProp>`
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
  ${({ $focusMode }) =>
    $focusMode &&
    css`
      opacity: ${FOCUS_MODE_OPACITY};
      &:hover {
        opacity: 1;
      }
    `}
`

export const FlexBetween = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

export const FloatButton = styled(Button)`
  border-radius: 50%;
  height: 3.2rem;
  cursor: pointer;
  width: 3.2rem;
  padding: 0.8rem;
  :hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

export const FloatingMenu = styled.div`
  height: fit-content;
  max-height: 400px;
  width: 250px;

  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background.card};
`

export const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  text-align: left;
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background.card};
  :hover {
    cursor: pointer;
    border-radius: 0.5rem;
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.background.highlight};
  }
`

export const ClickableIcon = styled(Icon)`
  cursor: pointer;
  border-radius: 50%;
  :hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const FloatingButton = () => {
  const location = useLocation()
  const [showFloating, setShowFloating] = useState<boolean>()

  const checkFloating = (): boolean => {
    if (location.pathname === '/') return true
    const showNavPaths = ['/editor', '/search', '/snippets', '/archive', '/tasks', '/settings', '/tag', '/integrations']

    for (const path of showNavPaths) {
      if (location.pathname.startsWith(path)) return true
    }

    return false
  }

  useEffect(() => {
    setShowFloating(checkFloating())
  }, [location])

  const [showMenu, setMenu] = useState<boolean>(false)

  const toggleModal = useHelpStore((store) => store.toggleModal)
  const focusMode = useLayoutStore((store) => store.focusMode)
  const authenticated = useAuthStore((store) => store.authenticated)
  const toggleOpen = useGameStore((store) => store.openModal)

  const onShortcutClick = () => {
    setMenu(false)
    toggleModal()
  }

  const openGame = () => {
    setMenu(false)
    toggleOpen()
  }

  if (!authenticated) return null
  if (!showFloating) return null

  return (
    <Float $focusMode={focusMode.on}>
      {!showMenu ? (
        <FloatButton id="wd-mex-floating-button" key="wd-mex-floating-button" onClick={() => setMenu(true)}>
          <Icon icon={QuestionMarkIcon} />
        </FloatButton>
      ) : (
        <FloatingMenu>
          <FlexBetween>
            <h3>Help</h3>
            <ClickableIcon onClick={() => setMenu(false)} width="24" icon={CloseIcon} />
          </FlexBetween>

          <div>
            <Tippy interactive theme="markdown-help" placement="right" content={<AutoformatHelp />}>
              <MenuItem key="wd-mex-shortcuts-button">
                <MexIcon fontSize={20} margin="0 1rem 0 0" icon="ri:text" /> Markdown Hints
              </MenuItem>
            </Tippy>
            <MenuItem key="wd-mex-shortcuts-button" onClick={onShortcutClick}>
              <MexIcon fontSize={20} margin="0 1rem 0 0" icon="fluent:keyboard-24-filled" /> Keyboard Shortcuts
            </MenuItem>
            <MenuItem key="wd-mex-shortcuts-button" onClick={openGame}>
              <MexIcon fontSize={20} margin="0 1rem 0 0" icon="fluent:games-24-filled" /> Onboarding Game
            </MenuItem>
          </div>
        </FloatingMenu>
      )}
    </Float>
  )
}

export default FloatingButton
