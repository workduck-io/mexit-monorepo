import styled from 'styled-components'
import { Button } from './Buttons'

export const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
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
  }
  svg,
  img {
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
  margin-right: ${({ theme }) => theme.spacing.large};
`

export const Info = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.gray[8]};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`

export const InfoLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray[6]};
  margin-bottom: ${({ theme }) => theme.spacing.tiny};
`

interface InfoDataProps {
  small?: boolean
}

export const InfoData = styled.div<InfoDataProps>`
  word-break: break-all;
  color: ${({ theme }) => theme.colors.text.default};
  font-size: ${({ small }) => (small ? 0.9 : 1.2)}rem;
  ${Button} {
    color: ${({ theme }) => theme.colors.primary};
    float: left;
    margin: 0 ${({ theme }) => theme.spacing.small} 0 0;
  }
`
