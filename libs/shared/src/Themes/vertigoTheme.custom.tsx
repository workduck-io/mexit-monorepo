import { transparentize } from 'polished'
import { css } from 'styled-components'

import { ArchivedNode } from '../Style/Archive'
import { BalloonToolbarBase } from '../Style/BalloonToolbar.styles'
import { BackCard } from '../Style/Card'
import { ComboboxItem,ComboboxRoot } from '../Style/Combobox'
import { EditorStyles, MenuTrigger, Widget } from '../Style/Editor'
import { EditorPreviewWrapper } from '../Style/EditorPreview.styles'
import { MainNav,NavButton, NavWrapper } from '../Style/Nav'
import { StyledMenu } from '../Style/NodeSelect.style'
import { SILink } from '../Style/QuickLinkElement.styles'
import { Result, ResultHeader, SearchContainer, SplitSearchPreviewWrapper } from '../Style/Search'
import { SettingsOptions, SettingTitle } from '../Style/Settings'
import { CreateSnippet } from '../Style/Snippets'
import { TodoContainer } from '../Style/Todo.style'
import { Title } from '../Style/Typography'

import { SpaceBlocksCss } from './spaceBlocks'

const textStyleColors = css`
  b,
  i,
  strong {
    color: #a372e3;
  }
`

const headingColors = css`
  h1 {
    color: #dfcc84;
  }
  h2 {
    color: #abc86f;
  }
  h3 {
    color: #83c182;
  }
  h4 {
    color: #82c1aa;
  }
  h5 {
    color: #82bec1;
  }
  h6 {
    color: #699ecf;
  }
`

const listColors = css`
  li::marker {
    color: ${({ theme }) => transparentize(0.5, theme.colors.secondary)};
  }
`
const grayMixerTrans = (n: number) => css`
  ${({ theme }) => transparentize(0.33, theme.colors.gray[n])}
`

const heightMain = `calc(100vh - 4rem)`

const edStyles = css`
  ${MenuTrigger} {
    background-color: ${({ theme }) => theme.colors.gray[10]};
  }
  ${EditorStyles} {
    transition: all 0.25s ease-in-out;
    blockquote {
      background-color: ${({ theme }) => theme.colors.gray[9]};
    }
    ${headingColors}
    ${textStyleColors}
    ${listColors}
  }
  ${SILink} {
    .ILink_decoration {
      color: ${({ theme }) => theme.colors.primary};
      &_left {
      }
      &_right {
        margin-left: ${({ theme }) => theme.spacing.tiny};
      }
      &_value {
        font-weight: 600;
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
  ${Widget} {
    background-color: ${grayMixerTrans(9)};
  }
  ${BalloonToolbarBase} {
    background-color: ${({ theme }) => theme.colors.gray[8]};
    box-shadow: 0px 10px 20px ${({ theme }) => transparentize(0.75, theme.colors.palette.black)};
    .slate-ToolbarButton-active,
    .slate-ToolbarButton:hover {
      color: ${({ theme }) => theme.colors.secondary};
      background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
    }
  }
  ${EditorPreviewWrapper} {
    ${EditorStyles} {
      background: transparent;
    }
  }
  ${ComboboxRoot} {
    backdrop-filter: blur(10px);
    background: ${grayMixerTrans(9)};
  }
  ${ComboboxItem} {
    & > svg {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`

const todoStyles = css`
  ${TodoContainer} {
    ${EditorStyles} {
      padding: 0;
    }
  }
`

const settingsStyles = css`
  ${SettingsOptions} {
    padding: ${({ theme }) => theme.spacing.medium};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
  ${SettingTitle} {
    &:hover {
      background-color: ${grayMixerTrans(8)};
    }
  }
  ${BackCard} {
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

const gridCardStyles = css`
  ${ArchivedNode}, ${Result} {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    overflow: hidden;
  }
  ${ResultHeader} {
    background-color: ${grayMixerTrans(9)};
  }
  ${CreateSnippet} {
    background-color: ${grayMixerTrans(10)};
  }
`

const searchStyles = css`
  ${SearchContainer} {
    margin-right: 3rem;
  }
  ${SplitSearchPreviewWrapper} {
    ${Title} {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

const navStyles = css`
  ${NavWrapper} {
    overflow: hidden;
  }
  ${MainNav} {
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
  ${NavButton} {
    margin-top: 0;
  }
`

const sidebarStyles = css``

const modalStyles = css`
  .ModalContent {
    border: none;
  }
  .ModalOverlay {
  }

  ${StyledMenu} {
    box-shadow: 0px 4px 8px ${({ theme }) => transparentize(0.5, theme.colors.palette.black)};
    background-color: ${({ theme }) => theme.colors.gray[9]};
  }
`

const setFonts = (fontFamily: string) => css`
  body {
    font-family: ${fontFamily};
  }
  ${EditorStyles} {
    font-family: ${fontFamily};
  }
`

const globalStyles = css`
  ${setFonts('"Inter", sans-serif')}

  ::selection {
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
    background: ${({ theme }) => transparentize(0.5, theme.colors.primary)};
  }

  body {
    background-color: ${({ theme }) => theme.colors.gray[10]};
  }
`

const palette = { body: '#211E33', border: '#332A47' }

const containerStyle = css`
  background-color: ${transparentize(0.15, palette.body)};
  box-shadow: 0px 15px 40px ${({ theme }) => transparentize(0.9, theme.colors.palette.black)};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

const containerStyleReset = css`
  background-color: transparent;
  box-shadow: none;
  border: none;
`

const spaceBlocks = SpaceBlocksCss({ containerStyle, containerStyleReset, heightMain })

export const VertigoStyles = css`
  ${spaceBlocks}
  ${globalStyles}
  ${modalStyles}
  ${navStyles}
  ${sidebarStyles}
  ${settingsStyles}
  ${searchStyles}
  ${gridCardStyles}
  ${edStyles}
  ${todoStyles}
`
