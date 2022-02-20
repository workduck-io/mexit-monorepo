import { transparentize } from 'polished'
import styled from 'styled-components'

export const Card = styled.div`
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.medium};
  height: 400px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
`

export const BackCard = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: 0px 20px 100px ${({ theme }) => transparentize(0.75, theme.colors.primary)};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => theme.colors.gray[8]};
  outline: none;
  padding: ${({ theme }) => theme.spacing.large};
  margin: ${({ theme }) => theme.spacing.large};
  min-width: 300px;
  max-width: 600px;
`

export const FooterCard = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => theme.colors.gray[8]};
  outline: none;
  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.medium}`};
`
