import { transparentize } from 'polished'
import styled, { css, keyframes } from 'styled-components'

import { Button } from './Buttons'
import { CardShadow } from './Helpers'
import { TagFlex } from './TagsRelated.styles'

export const EditorPreviewWrapper = styled.div`
  background: ${({ theme }) => transparentize(0.5, theme.colors.gray[9])} !important;

  backdrop-filter: blur(10px);

  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.fade};
  height: 32vh;
  max-height: 32vh;
  width: 36vw;
  max-width: 36vw;

  overflow-y: auto;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;

  ${CardShadow}
`

export const EditorPreviewNoteName = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};

  cursor: pointer;

  svg {
    color: ${({ theme }) => theme.colors.text.fade};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    svg {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

const PrimaryBorderKeyFrames = (theme: any) => keyframes`
  0% { border-color: transparent; }
  50% { border-color: ${theme.colors.primary}; }
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
          border-color: ${theme.colors.primary};
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
  background: ${({ theme }) => transparentize(0.5, theme.colors.gray[9])} !important;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[8]};
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.small};

  ${Button} {
    color: ${({ theme }) => theme.colors.text.fade};
    background: transparent;
    padding: ${({ theme }) => theme.spacing.tiny};
    border: 1px solid ${({ theme }) => transparentize(0.5, theme.colors.text.fade)};

    :hover {
      svg {
        color: ${({ theme }) => theme.colors.palette.red};
      }
      border: 1px solid ${({ theme }) => transparentize(0.5, theme.colors.palette.red)};
    }
  }

  ${TagFlex} {
    background: ${({ theme }) => transparentize(0.5, theme.colors.gray[7])};
    flex-grow: 1;
    :hover {
      background: ${({ theme }) => theme.colors.primary};
    }
  }
`
