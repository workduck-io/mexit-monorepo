import { css } from 'styled-components'

import { MexIcons, MexNodeIcons } from '../Components/Icons'

type Pixels = number // Pixels in integer

export const HoverFade = css`
  opacity: 0.5;
  transition: opacity 0.25s ease-in-out;
  &:hover {
    opacity: 1;
  }
`

export const ShowOnHoverIconStyles = css`
  position: relative;
  .showOnHoverIcon {
    z-index: 2;
    transition: right 0.2s ease-in-out, width 0.2s ease-in-out, opacity 0.2s ease-in-out;
    background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
    width: 0rem;
    overflow: hidden;
    color: ${({ theme }) => theme.tokens.text.fade};
    opacity: 0;
  }

  &:hover {
    .showOnHoverIcon {
      right: -1.45em;
      width: 16px;
      height: 16px;
      color: ${({ theme }) => theme.tokens.text.default};
      opacity: 1;
    }
  }
`

export const SubtleGlow = css`
  background-color: ${({ theme }) => theme.tokens.colors.primary.default};
  box-shadow: 0px 2px 6px ${({ theme }) => theme.tokens.colors.primary.default};
  color: ${({ theme }) => theme.tokens.colors.primary.text};
`

export const HoverSubtleGlow = css`
  transition: 0.3s ease;
  &:hover {
    transition: 0s ease;
    ${SubtleGlow}
  }
`

export const PixelToCSS = (x: Pixels): string => {
  return `${String(x)}px`
}

// TODO: cannot comment lines inside styled-components, also surfaces.scrollbar not found
/* background: ${color ? color : ({ theme }) => `rgba(${theme.rgbTokens.surfaces.scrollbar.thumb}, 0.25)`}; */
export const ScrollStyles = (color = undefined, width = 8) => css`
  &::-webkit-scrollbar {
    width: ${width}px;
  }
  &::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0);
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 0px;
    border: 2px solid transparent;
    background: ${color ? color : ({ theme }) => `rgba(${theme.rgbTokens.surfaces.scrollbar.thumb}, 0.25)`};
    border: 2px solid rgba(0, 0, 0, 0);
    background-clip: content-box;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${color ? color : ({ theme }) => `rgba(${theme.rgbTokens.surfaces.scrollbar.thumbHover}, 0.5)`};
  }
  &::-webkit-scrollbar-track {
    background: none;
  }
`

export const ThinScrollbar = ScrollStyles()

export const CardShadow = css`
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
`

export const getLineIcons = (icon: string) => {
  if (MexIcons[icon]) return MexIcons[icon]
}

export const getLineIconsIconify = (icon: string) => {
  if (MexNodeIcons[icon]) return MexNodeIcons[icon]
}
