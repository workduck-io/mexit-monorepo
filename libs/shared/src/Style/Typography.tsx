import styled, { css } from 'styled-components'

import { BodyFont, MainFont } from './Search'

export const Title = styled.h1<{ colored?: boolean; noMargin?: boolean; center?: boolean }>`
  ${({ noMargin }) =>
    noMargin &&
    css`
      margin: 0;
    `}

  ${({ center }) =>
    center &&
    css`
      text-align: center;
    `}

  ${({ theme, colored }) =>
    colored &&
    css`
      color: ${theme.tokens.colors.primary.default};
    `}
`

export const TitleText = styled.div`
  flex-grow: 1;
`

export const TextElement = styled.span<{ size?: 'small' | 'medium' | 'large' }>`
  ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return BodyFont
      case 'medium':
        return MainFont
      case 'large':
        return 'font-size: 1.2em;'
    }
  }};

  font-weight: 600;
  opacity: 0.4;
  color: ${({ theme }) => theme.tokens.text.fade};
  line-height: normal !important;
`

export const Description = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  font-size: ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return '0.8rem'
      case 'medium':
        return '1rem'
      case 'large':
        return '1.2rem'
    }
  }};
  color: ${({ theme }) => theme.tokens.text.fade};
`

export const Heading = styled.div`
  font-size: 1.1rem;
  margin: 5px 0 5px;
  font-weight: lighter;
  color: ${({ theme }) => theme.tokens.text.fade};
`
