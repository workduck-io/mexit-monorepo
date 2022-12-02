import { NavLink } from 'react-router-dom'

import { transparentize } from 'polished'
import styled from 'styled-components'

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
  height: calc(100vh - ${({ theme }) => (theme.additional.hasBlocks ? '18rem' : '14rem')});
  width: 98%;
  overflow-y: auto;
  padding: 2rem;
`
