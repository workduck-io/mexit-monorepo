import { MediaEmbed } from '@udecode/plate'
import styled, { css } from 'styled-components'

interface MaximizeProp {
  max: boolean
}
interface IFrameWrapperProps extends MaximizeProp {
  expand: boolean
}

export const IFrameWrapper = styled.div<IFrameWrapperProps>`
  position: relative;
  transition: height 0.2s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  iframe {
    width: 100%;
    ${({ max, expand }) =>
      max
        ? css`
            height: calc(90vh - 48px);
          `
        : css`
            height: ${expand ? '48rem' : '24rem'};
          `}
  }
  > * {
    min-width: 32rem;
  }
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
          background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
          border-radius: ${({ theme }) => theme.borderRadius.small};
        `
      : css`
          position: relative;
        `}
`

export const IframeStyles = styled.iframe`
  width: 100%;
  height: 100%;

  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const IFrame = styled.iframe`
  ${IframeStyles}
`

export const StyledMediaEmbed = styled(MediaEmbed)`
  ${IframeStyles}
`

export const MediaInputWrapper = styled.div`
  display: flex;
  align-items: center;

  font-size: 0.85rem;

  margin-top: ${({ theme }) => theme.borderRadius.small};

  background: ${({ theme }) => theme.tokens.surfaces.modal};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.tokens.text.subheading};

  :focus-within {
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  }
`

export const InputPrompt = styled.div`
  display: flex;
  align-items: center;
  max-width: 4rem;
  color: ${({ theme }) => theme.tokens.colors.primary.default};

  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
`

export const MediaInput = styled.input`
  width: 100%;

  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  padding-left: 0;
  border: none;
  color: ${({ theme }) => theme.tokens.text.subheading};
  background: none;
  margin: 0;

  border-top-right-radius: ${({ theme }) => theme.borderRadius.small};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.small};

  :focus {
    background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
    outline: none;
  }
`

export const MediaHtml = styled.div`
  > div {
    display: flex;
  }
  background: ${({ theme }) => theme.tokens.surfaces.s[3]};
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
