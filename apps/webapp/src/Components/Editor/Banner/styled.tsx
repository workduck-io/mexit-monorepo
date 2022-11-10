import styled from 'styled-components'

export const BannerContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const Group = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`
