import { NavLink } from 'react-router-dom'

import styled from 'styled-components'

export const SettingsContentContainer = styled.section`
  display: flex;
  width: 100%;
  margin: ${({ theme }) => `${theme.spacing.large}`};
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
  color: ${({ theme }) => theme.tokens.text.default};
  gap: ${({ theme }) => theme.spacing.small};
  text-decoration: none;

  &:hover {
    text-decoration: none;
    background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
    box-shadow: ${({ theme }) => theme.tokens.shadow.small};
  }

  &.active {
    color: ${({ theme }) => theme.tokens.colors.primary.text};
    background-color: ${({ theme }) => theme.tokens.colors.primary.default};
    svg {
      color: ${({ theme }) => theme.tokens.colors.primary.text};
    }
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};

  svg {
    height: 1.5rem;
    width: 1.5rem;
    color: ${({ theme }) => theme.tokens.colors.secondary};
  }
`

export const SettingsContent = styled.div`
  flex: 4;
  width: 98%;
  overflow-y: auto;
  padding: 1rem 2rem;
`
