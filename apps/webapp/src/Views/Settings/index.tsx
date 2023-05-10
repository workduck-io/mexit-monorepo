import { Outlet } from 'react-router-dom'

import keyboardBoxLine from '@iconify/icons-fluent/keyboard-24-regular'
import informationLine from '@iconify/icons-ri/information-line'
import { Icon } from '@iconify/react'
import paintBrushFill from '@iconify-icons/ri/paint-brush-fill'
import user3Line from '@iconify-icons/ri/user-3-line'
import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import {
  MainHeader,
  PageContainer,
  SettingsContainer,
  SettingsContent,
  SettingsOptions,
  SettingTitle,
  Title
} from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useAuthentication } from '../../Stores/useAuth'

const Margin = styled.div`
  margin: 1rem 1rem 0.5rem 0;
  display: flex;
  justify-content: space-between;
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
    <PageContainer>
      <MainHeader>
        <Title>Settings</Title>
      </MainHeader>
      <SettingsContainer>
        <SettingsOptions>
          <SettingTitle tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to="user">
            <Icon icon={user3Line} />
            Profile
          </SettingTitle>
          <SettingTitle tabIndex={-1} to="themes">
            <Icon icon={paintBrushFill} />
            Themes
          </SettingTitle>
          <SettingTitle tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to="shortcuts">
            <Icon icon={keyboardBoxLine} />
            Shortcuts
          </SettingTitle>
          <SettingTitle tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to="invite">
            <Icon icon="icon-park-solid:app-switch" />
            Workspace
          </SettingTitle>
          <SettingTitle tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to="about">
            <Icon icon={informationLine} />
            About
          </SettingTitle>
          <Margin />
          <Button onClick={onLogout}>Logout</Button>
        </SettingsOptions>
        <SettingsContent>
          <Outlet />
        </SettingsContent>
      </SettingsContainer>
    </PageContainer>
  )
}

export default Settings
