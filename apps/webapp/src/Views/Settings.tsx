import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { transparentize } from 'polished'
import paintBrushFill from '@iconify-icons/ri/paint-brush-fill'
import user3Line from '@iconify-icons/ri/user-3-line'
import { Icon } from '@iconify/react'

import { useAuthentication } from '../Stores/useAuth'
import { Button } from '@mexit/shared'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'

const IntegrationContainer = styled.section`
  margin-left: 4rem;
  flex: 1;
`

const Margin = styled.div`
  margin: 1rem 1rem 0.5rem 0;
  display: flex;
  justify-content: space-between;
`

const Title = styled.h1`
  padding: 2.5rem 1rem;
  font-size: 36px;
  line-height: 44px;
  user-select: none;
`

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

  const onLogout = async (e: any) => {
    e.preventDefault()
    await logout()
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
