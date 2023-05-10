import React from 'react'
import { useTrail } from 'react-spring'

import { useTheme } from 'styled-components'

import { NavTooltip, TitleWithShortcut } from '@workduck-io/mex-components'

import { API_BASE_URLS, useAuthStore } from '@mexit/core'
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

  const theme = useTheme()

  const trails = useTrail(workspaces.length, {
    from: {
      opacity: 0,
      transform: 'translateX(-25px)'
    },
    to: {
      opacity: 1,
      transform: 'translateX(0px)'
    },
    reset: !show,
    duration: 60,
    config: {
      mass: 1,
      tension: 120,
      friction: 15
    }
  })

  const handleOnShow = (event) => {
    event.stopPropagation()
    setShow((s) => !s)
  }

  const handleJoinWorkspace = (e) => {
    e.preventDefault()
    e.stopPropagation()

    setShow(false)
    window.open(`${API_BASE_URLS.frontend}${ROUTE_PATHS.workspace}/join`, '_blank')
  }

  return (
    <StyledSpaceSwitcher>
      <ActiveWorkspaceWrapper>
        <IconContainer>
          <NavTooltip delay={400} content={<TitleWithShortcut title={active.name} />}>
            <NavLogoWrapper onClick={handleOnShow}>
              <IconDisplay color={theme.tokens.colors.primary.default} icon={active.icon} size={32} />
            </NavLogoWrapper>
          </NavTooltip>
        </IconContainer>
      </ActiveWorkspaceWrapper>
      {show && (
        <VerticalCenter fade={show}>
          {trails.map((props, i) => {
            const workspace = workspaces[i]

            return (
              <WorkspaceIconContainer
                active={workspace.id === active.id}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()

                  setShow(false)
                  setActiveWorkspace(workspace.id)
                }}
                style={props}
              >
                <NavTooltip delay={400} content={<TitleWithShortcut title={workspace.name} />}>
                  <NavLogoWrapper>
                    <IconDisplay icon={workspace.icon} size={32} />
                  </NavLogoWrapper>
                </NavTooltip>
              </WorkspaceIconContainer>
            )
          })}
          <FlexEndButton>
            <IconContainer>
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
