import React, { useEffect, useMemo, useState } from 'react'
import { animated, useSpring } from 'react-spring'

import linkedinIcon from '@iconify/icons-logos/linkedin-icon'
import twitterIcon from '@iconify/icons-logos/twitter'
import globeIcon from '@iconify/icons-ph/globe'
import calendarEventLine from '@iconify/icons-ri/calendar-event-line'
import QuestionMarkIcon from '@iconify/icons-ri/question-mark'
import { Icon } from '@iconify/react'
import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { Float, Group, Links, StyledIcon } from '@mexit/shared'

import { useLayoutStore } from '../Stores/useLayoutStore'

interface PublicNodeFloatingButtonProps {
  firstVisit: boolean
}

const FloatButton = styled(Button)`
  border-radius: 50%;
  cursor: pointer;
  padding: 0.8rem;
  position: absolute;
  right: 2rem;
  bottom: 1rem;

  &:hover {
    border-color: ${({ theme }) => theme.tokens.colors.primary.default};
  }
`

const FloatingMenuHeader = styled(animated.div)<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  flex-direction: row;
  justify-content: space-between;
  white-space: nowrap;
  background-color: ${({ theme }) => theme.tokens.surfaces.tooltip.info};

  color: ${({ theme }) => theme.tokens.text.default};
  position: absolute;

  padding: 1rem 4rem;
  text-align: left;
  border-radius: 5px;
`

const FloatingMenu = styled(animated.div)`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.tokens.surfaces.tooltip.info};
  gap: ${({ theme }) => theme.spacing.medium};

  min-width: 250px;

  overflow: hidden;

  position: relative;
  bottom: 2rem;
  right: 6rem;

  border-radius: 5px;
  white-space: nowrap;

  ${Group} {
    gap: ${({ theme }) => theme.spacing.medium};
  }

  ${Links} {
    padding: ${({ theme }) => theme.spacing.small};
    border-radius: ${({ theme }) => theme.borderRadius.small};

    svg {
      margin: inherit;
    }
    :hover {
      background-color: ${({ theme }) => theme.tokens.surfaces.highlight};
    }
  }
`

const FloatingButton = styled(FloatButton)<{ visible: boolean }>`
  height: 3.2rem;
  cursor: pointer;
  width: 3.2rem;

  @media (min-width: 800px) {
    ${FloatingMenuHeader} {
      display: ${({ visible }) => !visible && 'none'};
    }

    :hover {
      ${FloatingMenuHeader} {
        display: ${({ visible }) => !visible && 'block'};
      }
    }
  }
`

const PublicNodeFloatingButton = ({ firstVisit }: PublicNodeFloatingButtonProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false)

  const focusMode = useLayoutStore((store) => store.focusMode)

  useEffect(() => {
    let clearFirstVisit: NodeJS.Timeout
    if (firstVisit) {
      clearFirstVisit = setTimeout(() => {
        if (!showMenu) setShowMenu(true)
      }, 60000)
    }

    return () => {
      if (clearFirstVisit) clearTimeout(clearFirstVisit)
    }
  }, [firstVisit])

  const menuProps = useSpring(
    useMemo(() => {
      const style = { height: '0', padding: '0' }

      if (showMenu) {
        style.height = '145px'
        style.padding = '1rem'
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
      </FloatingButton>

      {/* eslint-disable-next-line*/}
      {/* @ts-ignore */}
      <FloatingMenu style={menuProps}>
        Where to find us
        <Group>
          <Links href="https://workduck.io" target="_blank" rel="noopener norefer">
            <StyledIcon icon={globeIcon} />
          </Links>
          <Links href="https://www.linkedin.com/company/workduck-official" target="_blank" rel="noopener norefer">
            <StyledIcon icon={linkedinIcon} />
          </Links>
          <Links href="https://twitter.com/workduckio" target="_blank" rel="noopener norefer">
            <StyledIcon icon={twitterIcon} />
          </Links>
          <Links href="https://calendly.com/mihir-workduck/catch-up" target="_blank" rel="noopener norefer">
            <StyledIcon icon={calendarEventLine} />
          </Links>
        </Group>
      </FloatingMenu>
    </Float>
  )
}

export default PublicNodeFloatingButton
