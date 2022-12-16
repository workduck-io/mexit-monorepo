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
    position: absolute;
    right: 0;
    transition: right 0.2s ease-in-out, width 0.2s ease-in-out, opacity 0.2s ease-in-out;
    background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
    border-radius: ${({ theme }) => theme.borderRadius.tiny};
    width: 0rem;
    overflow: hidden;
    color: ${({ theme }) => theme.tokens.text.fade};
    padding: 0.25rem;
    height: 1.5rem;
    opacity: 0;
  }

  &:hover {
    .showOnHoverIcon {
      right: -1.45em;
      width: 1.5rem;
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

export const ScrollStyles = (color = undefined, width = 8) => css`
  &::-webkit-scrollbar {
    width: ${width}px;
  }
  &::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0);
  }
  &::-webkit-scrollbar-thumb {
    background: ${color ? color : ({ theme }) => `rgba(${theme.rgbTokens.surfaces.scrollbar.thumb}, 0.25)`};
    border-radius: 0px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.tokens.surfaces.scrollbar.thumbHover};
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
