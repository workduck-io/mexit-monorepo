import { transparentize } from 'polished'
import styled from 'styled-components'

export const InfoboxButton = styled.div`
  padding: ${({ theme }) => theme.spacing.tiny};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  display: flex;
  align-items: center;
  cursor: help;
  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: ${({ theme }) => transparentize(0.5, theme.colors.text.fade)};
  }
  :hover {
    background-color: ${({ theme }) => theme.colors.gray[8]};
    svg {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

export const InfoboxTip = styled.div`
  font-size: 0.9rem;
  h1 {
    color: ${({ theme }) => theme.colors.text.accent};
    margin: ${({ theme }) => theme.spacing.small} 0;
    font-size: 1rem;
  }
  p {
    font-size: 0.9rem;
    margin: ${({ theme }) => theme.spacing.small} 0;
  }
`
