import styled, { css, keyframes } from 'styled-components'

export const IconSelector = styled.button`
  display: flex;
  border: none;
  background: transparent;
  padding: ${({ theme }) => theme.spacing.tiny};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.tokens.text.default};

  :hover {
    background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  }
`

export const IconLoading = (theme: any) => keyframes`
  0% { color: ${theme.tokens.colors.primary.default};; }
  100% { color: ${theme.tokens.colors.yellow}; }
`

export const IconWrapper = styled.div<{ size?: number; isLoading?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;

  ${({ size }) => {
    const calcSize = size ? `${size}px` : '1rem'
    return css`
      font-family: EmojiMart, 'Segoe UI Emoji', 'Segoe UI Symbol', 'Segoe UI', 'Apple Color Emoji', 'Twemoji Mozilla',
        'Noto Color Emoji', 'Android Emoji';
      font-size: ${calcSize};
      width: ${calcSize};
      height: ${calcSize};
    `
  }}

  ${({ isLoading, theme }) =>
    isLoading &&
    css`
      animation: ${IconLoading(theme)} 1s infinite alternate;
    `}

  svg {
    width: 100%;
    height: 100%;
  }
`
