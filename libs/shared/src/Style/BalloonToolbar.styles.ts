import { BalloonToolbarProps, getToolbarStyles, ToolbarBase } from '@udecode/plate'
import { createStyles } from '@udecode/plate-styled-components'
import styled, { css, CSSProp } from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

import { BalloonToolbarStyleProps } from '../Types/BalloonToolbar.types'

export const getBalloonToolbarStyles = (props: BalloonToolbarStyleProps) => {
  let color = 'rgb(157, 170, 182)'
  let colorActive = 'white'
  let background = 'rgb(36, 42, 49)'
  let borderColor = 'transparent'

  if (props.theme === 'light') {
    color = 'rgba(0, 0, 0, 0.50)'
    colorActive = 'black'
    background = 'rgb(250, 250, 250)'
    borderColor = 'rgb(196, 196, 196)'
  }

  const { placement = 'top' } = props

  const arrowStyle: CSSProp = [
    props.arrow &&
      css`
        ::after {
          left: 50%;
          content: ' ';
          position: absolute;
          margin-top: -1px;
          transform: translateX(-50%);
          border-color: ${background} transparent;
          border-style: solid;
        }
      `,

    props.arrow &&
      placement.includes('top') &&
      css`
        ::after {
          top: 100%;
          bottom: auto;
          border-width: 8px 8px 0;
        }
      `,

    props.arrow &&
      !placement.includes('top') &&
      css`
        ::after {
          top: auto;
          bottom: 100%;
          border-width: 0 8px 8px;
        }
      `
  ]

  const arrowBorderStyle: CSSProp = [
    props.arrow &&
      placement.includes('top') &&
      props.theme === 'light' &&
      css`
        ::before {
          margin-top: 0;
          border-width: 9px 9px 0;
          border-color: ${borderColor} transparent;
        }
      `,
    props.arrow &&
      !placement.includes('top') &&
      props.theme === 'light' &&
      css`
        ::before {
          margin-top: 0;
          border-width: 0 9px 9px;
          border-color: ${borderColor} transparent;
        }
      `
  ]

  return createStyles(
    { prefixClassNames: 'BalloonToolbar', ...props },
    {
      root: [
        ...getToolbarStyles(props).root.css,
        css`
          position: absolute;
          white-space: nowrap;
          opacity: 100;
          transition: opacity 0.2s ease-in-out;
          color: ${color};
          background: ${background};
          z-index: 500;
          border: 1px solid ${borderColor};
          border-radius: 4px;

          .slate-ToolbarButton-active,
          .slate-ToolbarButton:hover {
            color: ${colorActive};
          }

          ::before {
            ${arrowBorderStyle}
          }
        `,
        ...arrowStyle,
        ...arrowBorderStyle
      ]
    }
  )
}

export const BalloonToolbarBase = styled(ToolbarBase)<BalloonToolbarProps>`
  display: flex;
  user-select: none;
  box-sizing: content-box;
  align-items: center;

  position: absolute;
  white-space: nowrap;
  opacity: 1;
  transition: width 0.5s ease, opacity 0.2s ease-in-out;
  color: ${({ theme }) => theme.tokens.text.default};
  ${({ theme }) => generateStyle(theme.editor.toolbar.balloonToolbar.wrapper)}
  z-index: 500;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.tiny};
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};

  .slate-ToolbarButton,
  .slate-ToolbarButton-active,
  .slate-ToolbarButton:hover {
    ${({ theme }) => generateStyle(theme.editor.toolbar.balloonToolbar.button)}
    border-radius: ${({ theme }) => theme.borderRadius.tiny};
    padding: ${({ theme: { spacing } }) => `${spacing.tiny}`};
  }

  .slate-ToolbarButton:hover {
    box-shadow: ${({ theme }) => theme.tokens.shadow.small};
  }

  .slate-ToolbarButton-active {
    svg {
      color: ${({ theme }) => theme.tokens.colors.primary.default};
    }
    background: rgba(${({ theme }) => theme.rgbTokens.colors.primary.default}, 0.2);
  }
`

export const BalloonToolbarInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};

  svg {
    width: 1rem;
    height: 1rem;
  }
`
