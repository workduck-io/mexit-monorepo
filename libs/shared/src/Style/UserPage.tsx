import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { BaseCard } from './Card'
import { AuthForm } from './Form'

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

export const UserCard = styled(BaseCard)`
  margin-top: ${({ theme }) => theme.spacing.large};
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  padding: calc(2 * ${({ theme }) => theme.spacing.large});

  ${AuthForm} {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.medium};
  }
`

export const ProfileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .defaultProfileIcon {
    padding: 1rem;
    background-color: ${({ theme }) => theme.tokens.colors.primary.default};
    color: ${({ theme }) => theme.tokens.colors.primary.default};
    box-shadow: 0px 12px 24px rgba(${({ theme }) => theme.rgbTokens.colors.primary.default}, 0.5);
  }
  svg,
  img {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    box-shadow: 0px 12px 24px rgba(${({ theme }) => theme.rgbTokens.colors.primary.default}, 0.5);
  }
  margin-left: -10rem;
  margin-top: 0rem;
`

export const Info = styled.div`
  background-color: transparent;
  width: 100%;
`

export const InfoLabel = styled.div`
  color: ${({ theme }) => theme.tokens.text.fade};
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
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  color: ${({ theme }) => theme.tokens.text.default};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: ${({ theme: { spacing } }) => `${spacing.tiny} 0`};

  &:focus-visible {
    border-color: ${({ theme }) => theme.tokens.colors.primary.default};
    outline: none;
  }

  border: 1px solid transparent;

  ${Button} {
    color: ${({ theme }) => theme.tokens.colors.primary.default};
    float: left;
  }
`

export const InfoDataText = styled.div`
  padding: ${({ theme: { spacing } }) => `${spacing.small} 8px`};
`
