import styled, { css, keyframes } from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { CardShadow, ScrollStyles } from './Helpers'
import { TagFlex } from './TagsRelated.styles'

export const EditorPreviewWrapper = styled.div`
  background: rgba(${({ theme }) => theme.rgbTokens.surfaces.modal}, 0.5) !important;

  backdrop-filter: blur(10px);
  overscroll-behavior: contain;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.tokens.text.fade};
  height: 50vh;
  max-height: 50vh;
  width: 36vw;
  max-width: 36vw;

  overflow-y: auto;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;

  ${CardShadow}
  ${ScrollStyles}
`

export const EditorPreviewNoteName = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};

  cursor: pointer;

  svg {
    color: ${({ theme }) => theme.tokens.text.fade};
  }

  &:hover {
    color: ${({ theme }) => theme.tokens.colors.primary.default};
    svg {
      color: ${({ theme }) => theme.tokens.colors.primary.default};
    }
  }
`

const PrimaryBorderKeyFrames = (theme: any) => keyframes`
  0% { border-color: transparent; }
  50% { border-color: ${theme.tokens.colors.primary.default}; }
  100% { border-color: transparent; }
`

export const PreviewActionHeader = styled.span`
  display: flex;
  align-items: center;
  gap: 0 ${({ theme }) => theme.spacing.small};
`

export const EditorPreviewEditorWrapper = styled.div<{ editable?: boolean; blink?: boolean }>`
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border-width: 1px;
  border-style: solid;

  ${({ blink, editable, theme }) =>
    blink &&
    !editable &&
    css`
      animation: 1s ease-out 1 ${PrimaryBorderKeyFrames(theme)};
    `}

  /* width: 36vw; */
  ${({ editable, theme }) =>
    editable
      ? css`
          transition: border-color 0.15s ease-in-out 0s;
          border-color: ${theme.tokens.colors.primary.default};
        `
      : css`
          transition: border-color 0.15s ease-in-out 0s;
          border-color: transparent;
        `}
`

export const EditorPreviewControls = styled.div<{ hasTags?: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  border-radius: ${({ theme }) => `${theme.borderRadius.small} ${theme.borderRadius.small} 0 0`};
  width: 100%;
  background: ${({ theme }) => theme.tokens.surfaces.s[3]} !important;
  border-bottom: 1px solid ${({ theme }) => theme.tokens.surfaces.s[2]};
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.small};

  ${Button} {
    color: ${({ theme }) => theme.tokens.text.fade};
    background: transparent;
    padding: ${({ theme }) => theme.spacing.tiny};
    border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[2]};

    :hover {
      svg {
        color: ${({ theme }) => theme.tokens.colors.red};
      }
      border: 1px solid rgba(${({ theme }) => theme.rgbTokens.colors.red}, 0.5);
    }
  }

  ${TagFlex} {
    background: ${({ theme }) => theme.tokens.surfaces.s[3]} !important;
    flex-grow: 1;
    :hover {
      background: ${({ theme }) => theme.tokens.colors.primary.default} !important;
    }
  }
`
