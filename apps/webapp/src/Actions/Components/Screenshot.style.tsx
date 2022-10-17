import styled, { css } from 'styled-components'

export const ImageEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
`

export const ImageEditorToolbar = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  padding: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => theme.colors.gray[9]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  width: 100%;
  justify-content: space-between;
`

export const Controls = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
`

export const ToggleAndSubmit = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
`

interface ImageEditState {
  isEditing: boolean
}

export const ImagePreview = styled.div<ImageEditState>`
  ${({ isEditing }) =>
    isEditing
      ? css`
          opacity: 0;
          z-index: -1;
          position: absolute;
        `
      : css`
          opacity: 1;
          z-index: 1;
        `}
`

export const ImageEditorMain = styled.div<ImageEditState>`
  ${({ isEditing }) =>
    isEditing
      ? css`
          opacity: 1;
          z-index: 1;
        `
      : css`
          opacity: 0;
          z-index: -1;
          position: absolute;
        `}
`

export const PreviewTitle = styled.h1`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.default};
  display: flex;
  align-items: center;
  justify-content: center;
`
