import { transparentize } from 'polished'
import styled, { css } from 'styled-components'
import { TagFlex } from '../../../components/mex/Tags/TagsRelated'
import { Button } from '../../../style/Buttons'
import { CardShadow } from '../../../style/helpers'

export const EditorPreviewWrapper = styled.div`
  background: ${({ theme }) => transparentize(0.5, theme.colors.gray[9])} !important;

  backdrop-filter: blur(10px);

  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.fade};
  max-height: 400px;
  max-width: 700px;

  overflow-y: auto;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;

  ${CardShadow}
  min-width: 400px;
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

export const EditorPreviewEditorWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
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
