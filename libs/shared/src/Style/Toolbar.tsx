import styled, { css } from 'styled-components'

const rgba = (cssVar: string, alpha: number) => {
  return `rgba(${cssVar}, ${alpha})`
}

export const getTippyStyles = (name: string, textColor: string, background: string, border?: string) => css`
  .tippy-box[data-theme~='${name}'] {
    background: ${background};
    color: ${textColor};
    box-shadow: ${({ theme }) => theme.tokens.shadow.medium};

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

  ${({ theme }) => getTippyStyles('mex', theme.tokens.text.fade, theme.tokens.surfaces.tooltip.default)}
  ${({ theme }) => getTippyStyles('mex-error', theme.tokens.text.fade, theme.tokens.colors.red)}
  ${({ theme }) => getTippyStyles('mex-bright', theme.tokens.colors.primary.text, theme.tokens.colors.primary.default)}

  ${({ theme }) =>
    getTippyStyles('markdown-help', theme.tokens.text.default, rgba(theme.rgbTokens.surfaces.tooltip.info, 0.6))}
  .tippy-box[data-theme~='markdown-help'] {
    background: ${({ theme }) => rgba(theme.rgbTokens.surfaces.tooltip.info, 0.6)};
    box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
    backdrop-filter: blur(10px);
    border-radius: ${({ theme }) => theme.borderRadius.small};
    max-width: 600px !important;
  }

  ${({ theme }) =>
    getTippyStyles('help-text', theme.tokens.text.default, rgba(theme.rgbTokens.surfaces.tooltip.info, 0.6))}
  .tippy-box[data-theme~='help-text'] {
    background: ${({ theme }) => rgba(theme.rgbTokens.surfaces.tooltip.info, 0.6)};
    color: ${({ theme }) => theme.tokens.text.accent};
    box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
    backdrop-filter: blur(10px);
    border-radius: ${({ theme }) => theme.borderRadius.small};
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
