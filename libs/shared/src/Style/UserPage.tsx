import { transparentize } from 'polished'
import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { BaseCard } from './Card'

export const SettingsCard = styled(BaseCard)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-width: 100%;
  min-height: 69vh;
  box-shadow: 0px 3px 9px rgb(0 0 0 / 50%);
  border: none;
  margin: 0;
`
export const ProfileContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.small};
`

export const ProfileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .defaultProfileIcon {
    padding: 1rem;
    background-color: ${({ theme }) => theme.colors.gray[8]};
    color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0px 12px 24px ${({ theme }) => transparentize(0.5, theme.colors.primary)};
  }
  svg,
  img {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    box-shadow: 0px 12px 24px ${({ theme }) => transparentize(0.5, theme.colors.primary)};
  }
  margin-right: ${({ theme }) => theme.spacing.large};
  margin-top: 5rem;
`

export const Info = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.gray[8]};
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
`

export const InfoLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
  margin: ${({ theme: { spacing } }) => `${spacing.medium} 0 3px`};
  display: flex;
  align-items: center;
  gap: ${({ theme: { spacing } }) => spacing.small};
  margin-left: ${({ theme }) => theme.spacing.small};
  max-width: max-content;
`

interface InfoDataProps {
  small?: boolean
}

export const InfoData = styled.div<InfoDataProps>`
  word-break: break-all;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.form.input.bg};
  color: ${({ theme }) => theme.colors.form.input.fg};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  padding: ${({ theme: { spacing } }) => `${spacing.small} 8px`};
  display: flex;
  align-items: center;
  margin: ${({ theme: { spacing } }) => `${spacing.tiny} 0`};

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }

  background-color: transparent;
  border: 1px solid transparent;

  ${Button} {
    color: ${({ theme }) => theme.colors.primary};
    float: left;
    margin: 0 ${({ theme }) => theme.spacing.small} 0 0;
  }
`
