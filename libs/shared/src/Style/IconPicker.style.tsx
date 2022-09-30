import styled, { css } from 'styled-components'

export const IconSelector = styled.button`
  display: flex;
  border: none;
  background: transparent;
  padding: ${({ theme }) => theme.spacing.tiny};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.default};

  :hover {
    background: ${({ theme }) => theme.colors.gray[8]};
  }
`

export const IconWrapper = styled.div<{ size?: number }>`
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

  svg {
    width: 100%;
    height: 100%;
  }
`
