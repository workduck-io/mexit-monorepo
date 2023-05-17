import React from 'react'
import { animated, useSpring, useTrail } from 'react-spring'

import { useTheme } from 'styled-components'

import { NavTooltip, TitleWithShortcut } from '@workduck-io/mex-components'

import { API_BASE_URLS, AppInitStatus, IS_DEV, useAuthStore, useStore } from '@mexit/core'
import { DefaultMIcons, IconDisplay, NavLogoWrapper } from '@mexit/shared'

import { ROUTE_PATHS } from '../../../Hooks/useRouting'

import {
  ActiveWorkspaceWrapper,
  FlexEndButton,
  IconContainer,
  StyledSpaceSwitcher,
  VerticalCenter,
  WorkspaceIconContainer
} from './styled'

const WorkspaceSwitcher = () => {
  const [show, setShow] = React.useState(false)
  const active = useAuthStore((store) => store.workspaceDetails)
  const workspaces = useAuthStore((store) => store.workspaces)
  const setActiveWorkspace = useAuthStore((store) => store.setActiveWorkspace)
  const setAppInitStatus = useAuthStore((store) => store.setAppInitStatus)

  const theme = useTheme()
  const { backup } = useStore()

  const trails = useTrail(workspaces.length, {
    from: {
      opacity: 0,
      transform: 'translateX(-25px)'
    },
    to: {
      opacity: 1,
      transform: 'translateX(0px)'
    },
    reset: true,
    duration: 60,
    config: {
      mass: 1,
      tension: 120,
      friction: 15
    }
  })

  const spring = useSpring({
    from: {
      opacity: show ? 0 : 1,
      transform: show ? 'rotateZ(-45deg)' : 'rotateZ(0deg)'
    },
    to: {
      opacity: show ? 1 : 0,
      transform: show ? 'rotateZ(0deg)' : 'rotateZ(-45deg)'
    }
  })

  const handleOnShow = (event) => {
    event.stopPropagation()
    event.preventDefault()

    setShow((s) => !s)
  }

  const handleJoinWorkspace = (e) => {
    e.preventDefault()
    e.stopPropagation()

    setShow(false)
    window.open(`${API_BASE_URLS.frontend}${ROUTE_PATHS.workspace}/join`, '_blank')
  }

  const handleWorkspaceClick = (id: string) => (event) => {
    event.preventDefault()
    event.stopPropagation()

    setShow(false)
    console.time('Took Backup and Restored in')
    backup().then(() => {
      setAppInitStatus(AppInitStatus.SWITCH)
    })
    setActiveWorkspace(id)
  }

  return (
    <StyledSpaceSwitcher>
      <ActiveWorkspaceWrapper>
        <IconContainer>
          {show ? (
            <animated.span style={spring} onClick={handleOnShow}>
              <IconDisplay icon={DefaultMIcons.CLEAR} size={48} />
            </animated.span>
          ) : (
            <NavTooltip delay={400} content={<TitleWithShortcut title="Switch Workspace" />}>
              <NavLogoWrapper onClick={handleOnShow}>
                <IconDisplay color={theme.tokens.colors.primary.default} icon={active?.icon} size={32} />
              </NavLogoWrapper>
            </NavTooltip>
          )}
        </IconContainer>
      </ActiveWorkspaceWrapper>

      {show && (
        <VerticalCenter>
          {trails.map((props, i) => {
            const workspace = workspaces[i]
            const tooltip = IS_DEV ? `${workspace?.name} (${workspace?.id})` : workspace?.name
            return (
              <WorkspaceIconContainer
                key={workspace.id}
                $active={workspace.id === active.id}
                onClick={handleWorkspaceClick(workspace.id)}
                style={props}
              >
                <NavTooltip delay={400} content={<TitleWithShortcut title={tooltip} />}>
                  <NavLogoWrapper>
                    <IconDisplay icon={workspace?.icon} size={32} />
                  </NavLogoWrapper>
                </NavTooltip>
              </WorkspaceIconContainer>
            )
          })}
          <FlexEndButton>
            <IconContainer primary>
              <NavTooltip delay={400} content={<TitleWithShortcut title="Join another Workspace" />}>
                <NavLogoWrapper onClick={handleJoinWorkspace}>
                  <IconDisplay icon={DefaultMIcons.ADD} size={32} />
                </NavLogoWrapper>
              </NavTooltip>
            </IconContainer>
          </FlexEndButton>
        </VerticalCenter>
      )}
    </StyledSpaceSwitcher>
  )
}

export default WorkspaceSwitcher
