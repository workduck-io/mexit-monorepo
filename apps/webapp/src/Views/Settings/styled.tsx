import styled from 'styled-components'

import { BackCard } from '@mexit/shared'

export const SettingsContainer = styled.section`
  display: flex;
`

export const SettingsCardContainer = styled(BackCard)`
  gap: ${({ theme }) => theme.spacing.large};
`

export const SettingsSidebar = styled.section`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
  margin: ${({ theme }) => `0 ${theme.spacing.large}`};
  gap: ${({ theme }) => theme.spacing.large};
`

export const InviteContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.medium} 0;
`

export const InviteCode = styled.div`
  opacity: 0.7;
  flex: 1;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: 2px dashed ${({ theme }) => theme.tokens.surfaces.separator};
  color: ${({ theme }) => theme.tokens.text.default};
`

export const InviteBox = styled.div`
  margin: ${({ theme }) => `${theme.spacing.small} 0`};
`

export const MembersContainer = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 400px;
  gap: ${({ theme }) => theme.spacing.small};
`

export const SmallHeading = styled.h3`
  font-size: 1.4rem;
  margin: 0;
  color: ${({ theme }) => theme.tokens.text.default};
`

export const StyledWorkspaceDetails = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.medium};
`

export const WorkspaceDetailsContainer = styled.section`
  display: flex;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.medium};
`
