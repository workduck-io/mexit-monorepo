import React, { useEffect } from 'react'
import { animated, useSpring, useTrail } from 'react-spring'

import { useTheme } from 'styled-components'

import { NavTooltip, TitleWithShortcut } from '@workduck-io/mex-components'

import { API, API_BASE_URLS, AppInitStatus, IS_DEV, useAuthStore, useStore } from '@mexit/core'
import { DefaultMIcons, IconDisplay, ItemOverlay, NavLogoWrapper, useItemSwitcher } from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import { resetSearchIndex } from '../../../Workers/controller'

import {
  ActiveWorkspaceWrapper,
  FlexEndButton,
  IconContainer,
  StyledSpaceSwitcher,
  VerticalCenter,
  WorkspaceIconContainer
} from './styled'

const Workspaces = ({ setShow, active, show }) => {
  const setActiveWorkspace = useAuthStore((store) => store.setActiveWorkspace)
  const setAppInitStatus = useAuthStore((store) => store.setAppInitStatus)
  const workspaces = useAuthStore((store) => store.workspaces)

  const { backup } = useStore()
  const { goTo } = useRouting()

  const { isLongPress } = useItemSwitcher(
    workspaces?.map((i) => ({
      id: i.id
    })),
    (item) => {
      handleWorkspaceClick(item.id)()
    }
  )

  useEffect(() => {
    setShow(isLongPress)
  }, [isLongPress])

  const handleJoinWorkspace = (e) => {
    e.preventDefault()
    e.stopPropagation()

    setShow(false)
    window.open(`${API_BASE_URLS.frontend}${ROUTE_PATHS.workspace}/join`, '_blank')
  }

  const handleWorkspaceClick = (id: string) => (event?) => {
    if (active?.id === id) {
      goTo(ROUTE_PATHS.home, NavigationType.push)
      setShow(false)
      return
    }

    event?.preventDefault()
    event?.stopPropagation()

    setShow(false)

    backup().then(() => {
      resetSearchIndex()
      setAppInitStatus(AppInitStatus.SWITCH)
    })

    setActiveWorkspace(id)

    API.user
      .updateActiveWorkspace({
        activeWorkspace: id
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const handleManageWorkspace = () => {
    goTo(ROUTE_PATHS.workspaceSettings, NavigationType.push)
    setShow(false)
  }

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

  if (!show) return

  return (
    <VerticalCenter>
      {trails.map((props, i) => {
        const workspace = workspaces[i]
        const tooltip = IS_DEV ? `${workspace?.name} (${workspace?.id})` : workspace?.name
        const isActive = workspace.id === active.id

        return (
          <WorkspaceIconContainer
            key={workspace.id}
            $active={isActive}
            onClick={handleWorkspaceClick(workspace.id)}
            style={props}
          >
            {isLongPress && <ItemOverlay>{i + 1}</ItemOverlay>}
            <NavTooltip delay={400} content={<TitleWithShortcut title={`${tooltip}${isActive ? ' (current)' : ''}`} />}>
              <NavLogoWrapper>
                <IconDisplay icon={workspace?.icon} size={32} />
              </NavLogoWrapper>
            </NavTooltip>
          </WorkspaceIconContainer>
        )
      })}
      <FlexEndButton>
        <IconContainer>
          <NavTooltip delay={400} content={<TitleWithShortcut title="Manage" />}>
            <NavLogoWrapper onClick={handleManageWorkspace}>
              <IconDisplay icon={DefaultMIcons.PEOPLE} size={32} />
            </NavLogoWrapper>
          </NavTooltip>
        </IconContainer>
        <IconContainer primary>
          <NavTooltip delay={400} content={<TitleWithShortcut title="Join another Workspace" />}>
            <NavLogoWrapper onClick={handleJoinWorkspace}>
              <IconDisplay icon={DefaultMIcons.ADD} size={32} />
            </NavLogoWrapper>
          </NavTooltip>
        </IconContainer>
      </FlexEndButton>
    </VerticalCenter>
  )
}

const WorkspaceSwitcher = () => {
  const [show, setShow] = React.useState(false)
  const active = useAuthStore((store) => store.workspaceDetails)

  const theme = useTheme()

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
                <IconDisplay
                  color={theme.tokens.colors.primary.default}
                  icon={active?.icon ?? DefaultMIcons.WORKSPACE}
                  size={32}
                />
              </NavLogoWrapper>
            </NavTooltip>
          )}
        </IconContainer>
      </ActiveWorkspaceWrapper>

      {<Workspaces active={active} show={show} setShow={setShow} />}
    </StyledSpaceSwitcher>
  )
}

export default WorkspaceSwitcher
