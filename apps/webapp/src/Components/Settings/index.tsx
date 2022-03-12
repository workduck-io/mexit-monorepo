import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { transparentize } from 'polished'
import informationLine from '@iconify-icons/ri/information-line'
import refreshLine from '@iconify-icons/ri/refresh-line'
import paintBrushFill from '@iconify-icons/ri/paint-brush-fill'
import keyboardBoxLine from '@iconify-icons/fluent/keyboard-24-regular'
import installLine from '@iconify-icons/ri/install-line'
import user3Line from '@iconify-icons/ri/user-3-line'
import { Icon } from '@iconify/react'

import { useAuthentication } from '../../Stores/useAuth'
import { Button } from '../../Style/Buttons'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'

export const SettingsContainer = styled.section`
  display: flex;
  width: 100%;
  user-select: none;
`

export const SettingsOptions = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
`

export const SettingTitle = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.default};
  gap: ${({ theme }) => theme.spacing.small};
  text-decoration: none;

  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => transparentize(0.5, theme.colors.background.card)};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
    svg {
      color: ${({ theme }) => theme.colors.text.oppositePrimary};
    }
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};

  svg {
    height: 1.5rem;
    width: 1.5rem;
    color: ${({ theme }) => theme.colors.secondary};
  }
`

export const SettingsContent = styled.div`
  flex: 4;
`

const Settings = () => {
  const { logout } = useAuthentication()
  const { goTo } = useRouting()

  const { addEventProperties } = useAnalytics()

  const onLogout = (e: any) => {
    e.preventDefault()
    logout()
    addEventProperties({ [CustomEvents.LOGGED_IN]: false })
    /**
     * Sessions ends after 30mins of inactivity
     *
     * identifyUser(undefined)
     * */

    goTo(ROUTE_PATHS.login, NavigationType.push)
  }

  return (
    <IntegrationContainer>
      <Title>Settings</Title>
      <SettingsContainer>
        <SettingsOptions>
          <SettingTitle tabIndex={-1} to="themes">
            <Icon icon={paintBrushFill} />
            Themes
          </SettingTitle>
          <SettingTitle tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to="user">
            <Icon icon={user3Line} />
            Profile
          </SettingTitle>
          <SettingTitle tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to="shortcuts">
            <Icon icon={keyboardBoxLine} />
            Shortcuts
          </SettingTitle>
          <SettingTitle tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to="about">
            <Icon icon={informationLine} />
            About
          </SettingTitle>
          <SettingTitle tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to="import">
            <Icon icon={refreshLine} />
            Import Notes
          </SettingTitle>
          <SettingTitle tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to="autoupdate">
            <Icon icon={installLine} />
            Automatic Updates
          </SettingTitle>
          <Margin />
          <Button onClick={onLogout}>Logout</Button>
        </SettingsOptions>
        <SettingsContent>
          <Outlet />
        </SettingsContent>
      </SettingsContainer>
    </IntegrationContainer>
  )
}

export default Settings
