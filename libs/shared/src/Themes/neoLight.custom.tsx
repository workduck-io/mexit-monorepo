import { MenuTrigger, EditorStyles, Widget, TodoContainer } from '@mexit/shared'
import { transparentize } from 'polished'
import { css } from 'styled-components'

import { BalloonToolbarBase } from '../Style/BalloonToolbar.styles'
import { DataInfobarWrapper } from '../Style/DataInfobar'
import { EditorPreviewWrapper } from '@mexit/shared'
import { BackCard } from '../Style/Card'
import { ComboboxRoot, ComboboxItem } from '../Style/Combobox'
import { Title } from '../Style/Elements'
import { SILink } from '../Style/QuickLinkElement.styles'
import { StyledMenu } from '@mexit/shared'
import { NavWrapper, NavButton } from '../Style/Nav'
import { Result, ResultHeader, SearchContainer, SplitSearchPreviewWrapper } from '../Style/Search'
import { SidebarDiv } from '../Style/Sidebar'
import { CreateSnippet } from '../Style/Snippets'
import { ArchivedNode } from '../Style/Archive'
import { SettingsOptions, SettingTitle } from '../Style/Settings'
import { SpaceBlocksCss } from './spaceBlocks'

const palette = { body: '#C4CCE0', background: '#D2D9EC', shadow: '#576BA4', primDark: '#4263B6' }

const grayMixerTrans = (n: number) => css`
  ${({ theme }) => transparentize(0.33, theme.colors.gray[n])}
`
const heightMain = `calc(100vh - 3rem)`

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

const containerStyle = css`
  background-color: ${palette.background};
  box-shadow: 0px 15px 40px ${transparentize(0.9, palette.shadow)};
`

const containerStyleReset = css`
  background-color: transparent;
  box-shadow: none;
`

const spaceBlocks = SpaceBlocksCss({ containerStyle, containerStyleReset, heightMain })

export const NeoLightStyles = css`
  body {
    background-color: ${palette.body};
  }
  ${searchStyles}
  ${todoStyles}
  ${spaceBlocks}
  ${modalStyles}
  ${navStyles}
  ${sidebarStyles}
  ${settingsStyles}
    ${gridCardStyles}
    ${edStyles}
`
