import styled, { css } from 'styled-components'
import { transparentize } from 'polished'

export const getTippyStyles = (name: string, textColor: string, background: string, border?: string) => css`
  .tippy-box[data-theme~='${name}'] {
    background: ${background};
    color: ${textColor};

    &[data-placement^='top'] > .tippy-arrow::before {
      border-top-color: ${border || background};
    }

    &[data-placement^='bottom'] > .tippy-arrow::before {
      border-bottom-color: ${border || background};
    }

    &[data-placement^='left'] > .tippy-arrow::before {
      border-left-color: ${border || background};
    }

    &[data-placement^='right'] > .tippy-arrow::before {
      border-right-color: ${border || background};
    }

    & > .tippy-backdrop {
      background: ${background};
    }

    & > .tippy-svg-arrow {
      fill: ${background};
    }
  }
`

export const TippyBalloonStyles = css`
  .tippy-box[data-theme~='transparent'] {
    background: transparent;

    .tippy-content {
      padding: 0;
    }

    &[data-placement^='top'] > .tippy-arrow::before {
      border-top-color: none;
    }

    &[data-placement^='bottom'] > .tippy-arrow::before {
      border-bottom-color: none;
    }

    &[data-placement^='left'] > .tippy-arrow::before {
      border-left-color: none;
    }

    &[data-placement^='right'] > .tippy-arrow::before {
      border-right-color: none;
    }

    & > .tippy-backdrop {
      background-color: none;
    }

    & > .tippy-svg-arrow {
      fill: none;
    }
  }

  ${({ theme }) => getTippyStyles('mex', theme.colors.text.fade, theme.colors.gray[8])}
  ${({ theme }) => getTippyStyles('mex-error', theme.colors.text.fade, theme.colors.palette.red)}
  ${({ theme }) => getTippyStyles('mex-bright', theme.colors.text.oppositePrimary, theme.colors.primary)}

  .tippy-box[data-theme~='markdown-help'] {
    background: ${({ theme }) => transparentize(0.4, theme.colors.gray[8])};
    color: ${({ theme }) => theme.colors.text.default};
    box-shadow: 0 0 8px 2px ${({ theme }) => theme.colors.gray[10]};
    backdrop-filter: blur(10px);
    border-radius: ${({ theme }) => theme.borderRadius.small};
    max-width: 600px !important;

    &[data-placement^='top'] > .tippy-arrow::before {
      border-top-color: ${({ theme }) => transparentize(0.9, theme.colors.gray[8])};
    }

    &[data-placement^='bottom'] > .tippy-arrow::before {
      border-bottom-color: ${({ theme }) => transparentize(0.9, theme.colors.gray[8])};
    }

    &[data-placement^='left'] > .tippy-arrow::before {
      border-left-color: ${({ theme }) => transparentize(0.9, theme.colors.gray[8])};
    }

    &[data-placement^='right'] > .tippy-arrow::before {
      border-right-color: ${({ theme }) => transparentize(0.9, theme.colors.gray[8])};
    }

    & > .tippy-backdrop {
      background: ${({ theme }) => transparentize(0.9, theme.colors.gray[8])};
    }

    & > .tippy-svg-arrow {
      fill: ${({ theme }) => transparentize(0.9, theme.colors.gray[8])};
    }
  }

  .tippy-box[data-theme~='help-text'] {
    background: ${({ theme }) => transparentize(0.4, theme.colors.gray[8])};
    color: ${({ theme }) => theme.colors.text.default};
    box-shadow: 0 0 8px 2px ${({ theme }) => theme.colors.gray[10]};
    backdrop-filter: blur(10px);
    border-radius: ${({ theme }) => theme.borderRadius.small};

    &[data-placement^='top'] > .tippy-arrow::before {
      border-top-color: ${({ theme }) => transparentize(0.9, theme.colors.gray[8])};
    }

    &[data-placement^='bottom'] > .tippy-arrow::before {
      border-bottom-color: ${({ theme }) => transparentize(0.9, theme.colors.gray[8])};
    }

    &[data-placement^='left'] > .tippy-arrow::before {
      border-left-color: ${({ theme }) => transparentize(0.9, theme.colors.gray[8])};
    }

    &[data-placement^='right'] > .tippy-arrow::before {
      border-right-color: ${({ theme }) => transparentize(0.9, theme.colors.gray[8])};
    }

    & > .tippy-backdrop {
      background: ${({ theme }) => transparentize(0.9, theme.colors.gray[8])};
    }

    & > .tippy-svg-arrow {
      fill: ${({ theme }) => transparentize(0.9, theme.colors.gray[8])};
    }
  }

  .tippy-box[data-animation='fade'][data-state='hidden'] {
    opacity: 0;
  }
  [data-tippy-root] {
    max-width: calc(100vw - 10px);
  }
  .tippy-box {
    position: relative;
    background-color: #333;
    color: #fff;
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.4;
    white-space: normal;
    outline: 0;
    transition-property: transform, visibility, opacity;
  }
  .tippy-box[data-placement^='top'] > .tippy-arrow {
    bottom: 0;
  }
  .tippy-box[data-placement^='top'] > .tippy-arrow:before {
    bottom: -7px;
    left: 0;
    border-width: 8px 8px 0;
    border-top-color: initial;
    transform-origin: center top;
  }
  .tippy-box[data-placement^='bottom'] > .tippy-arrow {
    top: 0;
  }
  .tippy-box[data-placement^='bottom'] > .tippy-arrow:before {
    top: -7px;
    left: 0;
    border-width: 0 8px 8px;
    border-bottom-color: initial;
    transform-origin: center bottom;
  }
  .tippy-box[data-placement^='left'] > .tippy-arrow {
    right: 0;
  }
  .tippy-box[data-placement^='left'] > .tippy-arrow:before {
    border-width: 8px 0 8px 8px;
    border-left-color: initial;
    right: -7px;
    transform-origin: center left;
  }
  .tippy-box[data-placement^='right'] > .tippy-arrow {
    left: 0;
  }
  .tippy-box[data-placement^='right'] > .tippy-arrow:before {
    left: -7px;
    border-width: 8px 8px 8px 0;
    border-right-color: initial;
    transform-origin: center right;
  }
  .tippy-box[data-inertia][data-state='visible'] {
    transition-timing-function: cubic-bezier(0.54, 1.5, 0.38, 1.11);
  }
  .tippy-arrow {
    width: 16px;
    height: 16px;
    color: #333;
  }
  .tippy-arrow:before {
    content: '';
    position: absolute;
    border-color: transparent;
    border-style: solid;
  }
  .tippy-content {
    position: relative;
    padding: 5px 9px;
    z-index: 1;
  }
`

export const ButtonSeparator = styled.div`
  height: 10px;
  margin: 0 ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
`

export const EditorBalloonStyles = css`
  .slate-BalloonToolbar {
  }
`
