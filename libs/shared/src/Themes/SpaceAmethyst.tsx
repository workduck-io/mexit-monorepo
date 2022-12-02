import { SpaceBlocksCss } from './spaceBlocks'
import { transparentize } from 'polished'
import { css } from 'styled-components'

const blockCss = SpaceBlocksCss({
  containerStyle: css`
    background-color: ${({ theme }) => transparentize(0.1, '#1b1e2a')};
    box-shadow: 0px 15px 40px ${({ theme }) => transparentize(0.9, theme.colors.palette.black)};
    border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.gray[6])};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  `,
  containerStyleReset: css`
    background-color: transparent;
    box-shadow: none;
    border-radius: 0;
  `,
  heightMain: 'calc(100vh - 4rem)'
})
export const SpaceAmethyst = css`
  ${blockCss}
`
