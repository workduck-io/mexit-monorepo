import styled, { css } from 'styled-components'

import { Button } from '@workduck-io/mex-components'

export const ImageEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  flex-grow: 1;
  width: 100%;
`

export const ImageEditorToolbar = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.medium};
  width: 100%;
  justify-content: space-between;
`

export const Controls = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: center;
`

export const ViewToggle = styled.div`
  display: flex;
  align-items: center;

  gap: ${({ theme }) => theme.spacing.small};

  background: ${({ theme }) => theme.tokens.surfaces.modal};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.tiny};

  ${Button} {
    padding: ${({ theme }) => `${theme.spacing.small}`};
    font-size: 0.9rem !important;
    gap: ${({ theme }) => theme.spacing.tiny};

    &.active {
      background: ${({ theme }) => theme.tokens.colors.primary.default};
      color: ${({ theme }) => theme.tokens.colors.primary.text};
    }
  }
`

export const RangeControlWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  user-select: none;

  background: ${({ theme }) => theme.tokens.surfaces.modal};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};

  label {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.tiny};
    color: ${({ theme }) => theme.tokens.text.fade};

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
  input[type='range'] {
    width: 5rem;
    -webkit-appearance: none !important;
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
    height: 4px;
    border-radius: 2px;
    &::-webkit-slider-thumb {
      -webkit-appearance: none !important;
      background: ${({ theme }) => theme.tokens.colors.primary.default};
      border-radius: 5px;
      height: 10px;
      width: 10px;
    }
  }
`

export const RangeValue = styled.div`
  color: ${({ theme }) => theme.tokens.colors.primary.default};
  width: 2rem;
`

export const ToggleAndSubmit = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
`

export const ImageContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

interface ImageEditState {
  isEditing: boolean
}

export const ImagePreview = styled.div<ImageEditState>`
  flex-grow: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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

const ReactCropCss = css`
  .ReactCrop {
    position: relative;
    display: inline-block;
    cursor: crosshair;
    overflow: hidden;
    max-width: 100%;
  }
  .ReactCrop *,
  .ReactCrop *::before,
  .ReactCrop *::after {
    box-sizing: border-box;
  }
  .ReactCrop--disabled,
  .ReactCrop--locked {
    cursor: inherit;
  }
  .ReactCrop__child-wrapper {
    max-height: inherit;
  }
  .ReactCrop__child-wrapper > img,
  .ReactCrop__child-wrapper > video {
    display: block;
    max-width: 100%;
    max-height: inherit;
    touch-action: none;
  }
  .ReactCrop__crop-selection {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate3d(0, 0, 0);
    cursor: move;
    box-shadow: 0 0 0 9999em rgba(0, 0, 0, 0.5);
    touch-action: none;
    border: 1px dashed #fff;
  }
  .ReactCrop--disabled .ReactCrop__crop-selection {
    cursor: inherit;
  }
  .ReactCrop--circular-crop .ReactCrop__crop-selection {
    border-radius: 50%;
    box-shadow: 0px 0px 1px 1px #fff, 0 0 0 9999em rgba(0, 0, 0, 0.5);
  }
  .ReactCrop__crop-selection:focus {
    outline: none;
    border-color: blue;
    border-style: solid;
  }
  .ReactCrop--invisible-crop .ReactCrop__crop-selection {
    display: none;
  }
  .ReactCrop__rule-of-thirds-vt::before,
  .ReactCrop__rule-of-thirds-vt::after,
  .ReactCrop__rule-of-thirds-hz::before,
  .ReactCrop__rule-of-thirds-hz::after {
    content: '';
    display: block;
    position: absolute;
    background-color: rgba(255, 255, 255, 0.4);
  }
  .ReactCrop__rule-of-thirds-vt::before,
  .ReactCrop__rule-of-thirds-vt::after {
    width: 1px;
    height: 100%;
  }
  .ReactCrop__rule-of-thirds-vt::before {
    left: 33.3333%;
    left: 33.3333333333%;
  }
  .ReactCrop__rule-of-thirds-vt::after {
    left: 66.6666%;
    left: 66.6666666667%;
  }
  .ReactCrop__rule-of-thirds-hz::before,
  .ReactCrop__rule-of-thirds-hz::after {
    width: 100%;
    height: 1px;
  }
  .ReactCrop__rule-of-thirds-hz::before {
    top: 33.3333%;
    top: 33.3333333333%;
  }
  .ReactCrop__rule-of-thirds-hz::after {
    top: 66.6666%;
    top: 66.6666666667%;
  }
  .ReactCrop__drag-handle {
    position: absolute;
  }
  .ReactCrop__drag-handle::after {
    position: absolute;
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.7);
    outline: 1px solid rgba(0, 0, 0, 0);
  }
  .ReactCrop__drag-handle:focus::after {
    border-color: blue;
    background: #2dbfff;
  }
  .ReactCrop .ord-nw {
    top: 0;
    left: 0;
    margin-top: -5px;
    margin-left: -5px;
    cursor: nw-resize;
  }
  .ReactCrop .ord-nw::after {
    top: 0;
    left: 0;
  }
  .ReactCrop .ord-n {
    top: 0;
    left: 50%;
    margin-top: -5px;
    margin-left: -5px;
    cursor: n-resize;
  }
  .ReactCrop .ord-n::after {
    top: 0;
  }
  .ReactCrop .ord-ne {
    top: 0;
    right: 0;
    margin-top: -5px;
    margin-right: -5px;
    cursor: ne-resize;
  }
  .ReactCrop .ord-ne::after {
    top: 0;
    right: 0;
  }
  .ReactCrop .ord-e {
    top: 50%;
    right: 0;
    margin-top: -5px;
    margin-right: -5px;
    cursor: e-resize;
  }
  .ReactCrop .ord-e::after {
    right: 0;
  }
  .ReactCrop .ord-se {
    bottom: 0;
    right: 0;
    margin-bottom: -5px;
    margin-right: -5px;
    cursor: se-resize;
  }
  .ReactCrop .ord-se::after {
    bottom: 0;
    right: 0;
  }
  .ReactCrop .ord-s {
    bottom: 0;
    left: 50%;
    margin-bottom: -5px;
    margin-left: -5px;
    cursor: s-resize;
  }
  .ReactCrop .ord-s::after {
    bottom: 0;
  }
  .ReactCrop .ord-sw {
    bottom: 0;
    left: 0;
    margin-bottom: -5px;
    margin-left: -5px;
    cursor: sw-resize;
  }
  .ReactCrop .ord-sw::after {
    bottom: 0;
    left: 0;
  }
  .ReactCrop .ord-w {
    top: 50%;
    left: 0;
    margin-top: -5px;
    margin-left: -5px;
    cursor: w-resize;
  }
  .ReactCrop .ord-w::after {
    left: 0;
  }
  .ReactCrop__disabled .ReactCrop__drag-handle {
    cursor: inherit;
  }
  .ReactCrop__drag-bar {
    position: absolute;
  }
  .ReactCrop__drag-bar.ord-n {
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    margin-top: -3px;
  }
  .ReactCrop__drag-bar.ord-e {
    right: 0;
    top: 0;
    width: 6px;
    height: 100%;
    margin-right: -3px;
  }
  .ReactCrop__drag-bar.ord-s {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 6px;
    margin-bottom: -3px;
  }
  .ReactCrop__drag-bar.ord-w {
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    margin-left: -3px;
  }
  .ReactCrop--new-crop .ReactCrop__drag-bar,
  .ReactCrop--new-crop .ReactCrop__drag-handle,
  .ReactCrop--fixed-aspect .ReactCrop__drag-bar {
    display: none;
  }
  .ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-n,
  .ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-e,
  .ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-s,
  .ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-w {
    display: none;
  }
  @media (pointer: coarse) {
    .ReactCrop .ord-n,
    .ReactCrop .ord-e,
    .ReactCrop .ord-s,
    .ReactCrop .ord-w {
      display: none;
    }
    .ReactCrop__drag-handle {
      width: 24px;
      height: 24px;
    }
  }
`
export const ImageEditorMain = styled.div<ImageEditState>`
  ${ReactCropCss}
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

/**
 * Styles for the screenshot component in the context of being rendered inside spotlight
 */
export const SpotlightScreenshotWrapper = styled.div`
  display: flex;
  width: 100%;
  ${ImageContent} {
    max-height: 100%;
    overflow: auto;
  }
`
