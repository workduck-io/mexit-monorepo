import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import CloseIcon from '@iconify/icons-ri/close-line'
import QuestionMarkIcon from '@iconify/icons-ri/question-mark'
import { Icon } from '@iconify/react'

import { FOCUS_MODE_OPACITY } from '@mexit/core'
import { FocusModeProp, Button, MexIcon } from '@mexit/shared'

import { useLayoutStore } from '../Stores/useLayoutStore'

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

interface PublicNodeFloatingButtonProps {
  firstVisit: boolean
}

const PublicNodeFloatingButton = ({ firstVisit }: PublicNodeFloatingButtonProps) => {
  const [showMenu, setMenu] = useState<boolean>(false)

  const focusMode = useLayoutStore((store) => store.focusMode)

  const openWDWebsite = () => {
    window.open('https://workduck.io', '_blank')
  }

  const openCalendlyLink = () => {
    window.open('https://google.com', '_blank')
  }

  useEffect(() => {
    let clearFirstVisit: NodeJS.Timeout
    if (firstVisit) {
      clearFirstVisit = setTimeout(() => {
        if (!showMenu) setMenu(true)
      }, 1000)
    }

    return () => {
      if (clearFirstVisit) clearTimeout(clearFirstVisit)
    }
  }, [firstVisit])

  return (
    <Float $focusMode={focusMode.on}>
      {!showMenu ? (
        <FloatButton
          id="wd-mex-floating-button"
          key="wd-mex-floating-button"
          // onMouseOver={() => setMenu(true)}
          // onMouseLeave={() => setMenu(false)}
          // onClick={() => openWDWebsite()}a
          onClick={() => setMenu(true)}
        >
          <Icon icon={QuestionMarkIcon} />
        </FloatButton>
      ) : (
        <FloatingMenu>
          <FlexBetween>
            <h3>Like What You See? Check out Workduck!</h3>
            <ClickableIcon onClick={() => setMenu(false)} width="24" icon={CloseIcon} />
          </FlexBetween>

          <div>
            <MenuItem key="wd-mex-website-button" onClick={openWDWebsite}>
              <MexIcon fontSize={20} margin="0 1rem 0 0" icon="ri:external-link-fill" />
              Workduck Website
            </MenuItem>
            <MenuItem key="wd-mex-calendly-button" onClick={openCalendlyLink}>
              <MexIcon fontSize={20} margin="0 1rem 0 0" icon="ri:calendar-2-line" /> Schedule a Call!
            </MenuItem>
          </div>
        </FloatingMenu>
      )}
    </Float>
  )
}

export default PublicNodeFloatingButton
