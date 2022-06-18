import styled from 'styled-components'

export const GlobalSectionContainer = styled.section`
  padding: ${({ theme }) => theme.spacing.medium};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[7]};
  display: flex;
  align-items: center;
  box-sizing: border-box;
  margin: 0 ${({ theme }) => theme.spacing.medium};
  gap: 0 ${({ theme }) => theme.spacing.medium};
`

export const GlobalSectionHeader = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 0 ${({ theme }) => theme.spacing.large};
`
