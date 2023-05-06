import styled from 'styled-components'

export const BannerContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const Group = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

export const MediaGroup = styled(Group)`
  @media (max-width: 1000px) {
    flex-direction: column;
    align-items: flex-start;
  }
`
