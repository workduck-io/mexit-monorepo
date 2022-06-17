// import { CardShadow } from '../../../../../style/helpers'
import styled, { css } from 'styled-components'

interface MaximizeProp {
  max: boolean
}
interface IFrameWrapperProps extends MaximizeProp {
  expand: boolean
}

export const IFrameWrapper = styled.div<IFrameWrapperProps>`
  position: relative;
  transition: padding 0.2s ease-in-out;

  ${({ max, expand }) =>
    max
      ? css`
          padding: calc(90vh - 48px) 0 0 0;
        `
      : css`
          padding: ${expand ? '100% 0 0 0' : '50% 0 0 0'};
        `}
`

export const RootElement = styled.div<MaximizeProp>`
  ${({ max }) =>
    max
      ? css`
          position: fixed;
          z-index: 200000;
          width: 90vw;
          height: 90vh;
          top: 5vh;
          left: 5vw;
          background-color: ${({ theme }) => theme.colors.gray[8]};
          border-radius: ${({ theme }) => theme.borderRadius.small};
        `
      : css`
          position: relative;
        `}
`

export const IFrame = styled.iframe`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  border-radius: ${({ theme }) => theme.borderRadius.small};
`

// Input

export const MediaInputWrapper = styled.div`
  display: flex;
  align-items: center;

  font-size: 0.85rem;

  margin-top: ${({ theme }) => theme.borderRadius.small};

  background: ${({ theme }) => theme.colors.background.modal};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.subheading};

  :focus-within {
    background: ${({ theme }) => theme.colors.background.card};
  }
`

export const InputPrompt = styled.div`
  display: flex;
  align-items: center;
  max-width: 4rem;
  color: ${({ theme }) => theme.colors.primary};

  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
`

export const MediaInput = styled.input`
  width: 100%;

  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  padding-left: 0;
  border: none;
  color: ${({ theme }) => theme.colors.text.subheading};
  background: none;
  margin: 0;

  border-top-right-radius: ${({ theme }) => theme.borderRadius.small};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.small};

  :focus {
    background-color: ${({ theme }) => theme.colors.background.card};
    outline: none;
  }
`

export const MediaHtml = styled.div`
  > div {
    display: flex;
  }
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme: { borderRadius } }) => `${borderRadius.small}`};
  overflow: hidden;
  blockquote {
    &.twitter-tweet {
      margin: 0;
      padding: ${({ theme: { spacing } }) => `${spacing.medium} ${spacing.large}`};
    }
  }

  iframe[src*='youtube'],
  iframe[src*='youtu.be'] {
    min-width: 100%;
    min-height: 500px;
  }

  iframe {
    min-width: 100%;
  }
`
