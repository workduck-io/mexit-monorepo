import { transparentize } from 'polished'
import { animated } from 'react-spring'
import styled, { css } from 'styled-components'
import { Button } from './Buttons'
import { GridCss } from './Grid'

export const ThemePreviews = styled.div`
  ${GridCss(3, 5)}
`

export const Theme = styled(animated.div)<{ selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  color: ${({ theme }) => theme.colors.text.default};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  height: inherit;
  overflow: auto;
  cursor: pointer;

  ${({ theme, selected }) =>
    selected
      ? css`
          padding: 0.8rem;
          border: 0.2rem solid ${theme.colors.primary};
        `
      : css`
          :hover {
            padding: 0.8rem;
            border: 0.2rem solid ${({ theme }) => theme.colors.background.highlight};
          }
        `}
`

export const ThemeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    margin: ${({ theme }) => theme.spacing.small} 0 ${({ theme }) => theme.spacing.medium};
  }
`

export const ThemePreview = styled.div<{ back?: string }>`
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  box-shadow: 0px 10px 20px ${({ theme }) => transparentize(0.6, theme.colors.palette.black)};
  background-color: ${({ theme }) => theme.colors.background.app};
  ${({ back }) =>
    back !== undefined &&
    css`
      background-image: url(${back});
      background-size: cover;
    `}}
`

export const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;

  ${Button} {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`
export const ThemeColorDots = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.small};

  div {
    width: 24px;
    height: 24px;
    margin: 6px;
    border-radius: 50%;
  }

  div:first-child {
    margin: 6px 6px 6px 0;
  }
  div:last-child {
    margin: 6px 0px 6px 6px;
  }
  .primary {
    background: ${({ theme }) => theme.colors.primary};
  }
  .secondary {
    background: ${({ theme }) => theme.colors.secondary};
  }
  .text {
    background: ${({ theme }) => theme.colors.text.default};
  }
  .text_fade {
    background: ${({ theme }) => theme.colors.text.fade};
  }
  .background {
    background: ${({ theme }) => theme.colors.background.card};
  }
`
