import { transparentize } from 'polished'
import { css } from 'styled-components'

import { ArchivedNode } from '../Style/Archive'
import { BalloonToolbarBase } from '../Style/BalloonToolbar.styles'
import { BackCard } from '../Style/Card'
import { ComboboxItem,ComboboxRoot } from '../Style/Combobox'
import { DataInfobarWrapper } from '../Style/DataInfobar'
import { EditorStyles, MenuTrigger, Widget } from '../Style/Editor'
import { EditorPreviewWrapper } from '../Style/EditorPreview.styles'
import { NavButton,NavWrapper } from '../Style/Nav'
import { StyledMenu } from '../Style/NodeSelect.style'
import { SILink } from '../Style/QuickLinkElement.styles'
import { Result, ResultHeader, SearchContainer, SplitSearchPreviewWrapper } from '../Style/Search'
import { SettingsOptions, SettingTitle } from '../Style/Settings'
import { SidebarDiv } from '../Style/Sidebar'
import { CreateSnippet } from '../Style/Snippets'
import { TodoContainer } from '../Style/Todo.style'
import { Title } from '../Style/Typography'

import { SpaceBlocksCss } from './spaceBlocks'

const palette = { body: '#1B1F3D' }

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
    border-radius: 1rem;
    transition: all 0.25s ease-in-out;
    blockquote {
      background-color: ${({ theme }) => theme.colors.gray[9]};
    }
    ${headingColors}
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
  ${DataInfobarWrapper} {
    border-radius: ${({ theme }) => theme.borderRadius.small};
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
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
  ${NavButton} {
    margin-top: 0;
  }
`

const sidebarStyles = css`
  ${SidebarDiv} {
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

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
const globalStyles = css`
  body {
    background-color: ${({ theme }) => theme.colors.gray[10]};
  }
`

export const NeoDarkStylesPlain = css`
  ${modalStyles}
  ${navStyles}
  ${sidebarStyles}
  ${settingsStyles}
  ${searchStyles}
  ${gridCardStyles}
  ${edStyles}
  ${todoStyles}
`

const containerStyle = css`
  background-color: ${palette.body};
  box-shadow: 0px 15px 40px ${({ theme }) => transparentize(0.9, theme.colors.palette.black)};
`

const containerStyleReset = css`
  background-color: transparent;
  box-shadow: none;
`
const spaceBlocks = SpaceBlocksCss({ containerStyle, containerStyleReset, heightMain })

export const NeoDarkStyles = css`
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
