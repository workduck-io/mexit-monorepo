import styled, { css } from 'styled-components'

export const Title = styled.h1<{ colored?: boolean }>`
  ${({ theme, colored }) =>
    colored &&
    css`
      color: ${theme.colors.primary};
    `}
`
export const Subtitle = styled.h2``

export const Para = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.fade};
`

export const Note = styled.p`
  margin: ${({ theme }) => theme.spacing.small} 0;
  color: ${({ theme }) => theme.colors.text.fade};
`
