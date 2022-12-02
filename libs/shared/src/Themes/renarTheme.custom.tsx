import { NeoDarkStylesPlain } from './neoDark.custom'
import { SpaceBlocksCss } from './spaceBlocks'
import { transparentize } from 'polished'
import { css } from 'styled-components'

const palette = { body: '#1B1F3D' }

const heightMain = `calc(100vh - 4rem)`

const containerStyle = css`
  background-color: ${transparentize(0.2, palette.body)};
  box-shadow: 0px 15px 40px ${({ theme }) => transparentize(0.9, theme.colors.palette.black)};
`

const containerStyleReset = css`
  background-color: transparent;
  box-shadow: none;
`

const blur = `10px`

const spaceBlocks = SpaceBlocksCss({ containerStyle, containerStyleReset, heightMain, blur })

export const RenarStylesWithoutContainer = css`
  ${NeoDarkStylesPlain}
`

export const RenarStyles = css`
  ${spaceBlocks}
  ${RenarStylesWithoutContainer}
`

const imperialContainerStyle = css`
  background-color: ${transparentize(0.2, palette.body)};
  box-shadow: 0px 15px 40px ${({ theme }) => transparentize(0.9, theme.colors.palette.black)};
`

const imperialContainerStyleReset = css`
  background-color: transparent;
  box-shadow: none;
`

const imperialSpaceBlocks = SpaceBlocksCss({
  containerStyle: imperialContainerStyle,
  containerStyleReset: imperialContainerStyleReset,
  heightMain
})

export const ImperialStyles = css`
  ${imperialSpaceBlocks}
  ${RenarStylesWithoutContainer}
`
