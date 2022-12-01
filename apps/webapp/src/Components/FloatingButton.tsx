import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import {
  ClickableIcon,
  FlexBetween,
  Float,
  FloatButton,
  FloatingMenu,
  MexIcon,
  StyledMenuItem} from '@mexit/shared'

import { useAuthStore } from '../Stores/useAuth'
import { useHelpStore } from '../Stores/useHelpStore'
import { useLayoutStore } from '../Stores/useLayoutStore'
import AutoformatHelp from './Autoformathelp'
import CloseIcon from '@iconify/icons-ri/close-line'
import QuestionMarkIcon from '@iconify/icons-ri/question-mark'
import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react'

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

  const onShortcutClick = () => {
    setMenu(false)
    toggleModal()
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
              <StyledMenuItem key="wd-mex-shortcuts-button">
                <MexIcon fontSize={20} margin="0 1rem 0 0" icon="ri:text" /> Markdown Hints
              </StyledMenuItem>
            </Tippy>
            <StyledMenuItem key="wd-mex-shortcuts-button" onClick={onShortcutClick}>
              <MexIcon fontSize={20} margin="0 1rem 0 0" icon="fluent:keyboard-24-filled" /> Keyboard Shortcuts
            </StyledMenuItem>
          </div>
        </FloatingMenu>
      )}
    </Float>
  )
}

export default FloatingButton
