import { transparentize } from 'polished'
import { css } from 'styled-components'

import { EditorStyles, NodeInfo, Button, AsyncButton, Widget } from '@mexit/shared'

import { EditorPreviewWrapper } from '../Components/Editor/EditorPreview/EditorPreview.styles'
import { DataInfobarWrapper } from '../Components/Infobar/DataInfobar'
import { BackCard } from '../Style/Card'
import { ComboboxRoot, ComboboxItem } from '../Style/Combobox'
import { GridWrapper } from '../Style/Grid'
import { NavWrapper, NavButton, Link } from '../Style/Nav'
import { Result, ResultHeader, SearchContainer } from '../Style/Search'
import { SidebarDiv } from '../Style/Sidebar'
import { SSnippet, CreateSnippet } from '../Style/Snippets'
import { ArchivedNode } from '../Views/Archive'
import { SettingsOptions, SettingTitle } from '../Views/Settings'

const grayMixerTrans = (n: number) => css`
  ${({ theme }) => transparentize(0.33, theme.colors.gray[n])}
`
const grayMainColor = css`
  ${grayMixerTrans(10)}
`

const hackerBorder = css`
  border: 2px solid ${({ theme }) => theme.colors.primary};
`

const hackerBorderThin = css`
  border: 1px solid ${({ theme }) => theme.colors.primary};
`

const edStyles = css`
  ${EditorStyles} {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    ${hackerBorder};
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
  }
  ${NodeInfo} {
    ${hackerBorder};
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
    ${Button}, ${AsyncButton} {
      ${hackerBorderThin}
      background-color: ${grayMixerTrans(9)};
      color: ${({ theme }) => theme.colors.primary};
      backdrop-filter: blur(10px);
    }
  }
  ${Widget} {
    ${hackerBorderThin}
    background-color: ${grayMixerTrans(8)};
  }
  ${DataInfobarWrapper} {
    height: calc(100vh - 4rem);
    ${hackerBorder};
    backdrop-filter: blur(10px);
    background-color: ${grayMainColor};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    margin-top: 2rem;
  }
  ${EditorPreviewWrapper} {
    ${hackerBorder};
    backdrop-filter: blur(10px);
    background: ${grayMainColor} !important;
    ${EditorStyles} {
      background: transparent;
    }
  }
  ${ComboboxRoot} {
    backdrop-filter: blur(10px);
    ${hackerBorder};
    background: ${grayMixerTrans(9)};
  }
  ${ComboboxItem} {
    & > svg {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`

const settingsStyles = css`
  ${SettingsOptions} {
    padding: ${({ theme }) => theme.spacing.medium};
    backdrop-filter: blur(10px);
    background-color: ${grayMainColor};
    ${hackerBorder};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
  ${SettingTitle} {
    border: 2px solid transparent;
    &:hover {
      ${hackerBorder};
      background-color: ${grayMixerTrans(8)};
    }
  }
  ${BackCard} {
    border: none;
    ${hackerBorder};
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

const gridCardStyles = css`
  ${ArchivedNode}, ${Result} {
    ${hackerBorder};
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
    border-radius: ${({ theme }) => theme.borderRadius.small};
    overflow: hidden;
  }
  ${ResultHeader} {
    ${hackerBorder};
    background-color: ${grayMixerTrans(9)};
  }
  ${SSnippet} {
    ${hackerBorder};
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
  }
  ${CreateSnippet} {
    ${hackerBorder};
    background-color: ${grayMixerTrans(8)};
    backdrop-filter: blur(10px);
  }
  ${SearchContainer} {
    margin-right: 3rem;
  }
`

const navStyles = css`
  ${SidebarDiv} {
    height: calc(100vh - 4rem);
    ${hackerBorder};
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
    border-radius: ${({ theme }) => theme.borderRadius.small};
    padding: 0 ${({ theme }) => theme.spacing.medium};
    .rc-tree .rc-tree-treenode span.rc-tree-switcher {
      color: ${({ theme }) => theme.colors.primary};
    }
    .rc-tree .rc-tree-treenode .rc-tree-node-selected {
      background-color: ${({ theme }) => theme.colors.primary};
      .rc-tree-title {
        color: ${({ theme }) => theme.colors.text.oppositePrimary} !important;
      }
      box-shadow: 0px 2px 6px ${({ theme }) => theme.colors.primary};
    }
  }
  ${NavWrapper} {
    padding: 0;
    margin: 2rem 0;
    overflow: auto;
    height: calc(100vh - 4rem);
    min-height: calc(100vh - 4rem);
    border-radius: ${({ theme }) => theme.borderRadius.small};
    ${hackerBorder};
    background-color: ${grayMainColor};
    backdrop-filter: blur(10px);
  }
  ${GridWrapper} {
    margin: 1rem;
    height: calc(100vh - 2rem);
    width: calc(100vw - 2rem);
    grid-gap: ${({ theme }) => theme.spacing.medium};
  }
  ${NavButton} {
    margin-top: 0;
  }
  ${Link} {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const HackerFonts = css`
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Space+Mono:wght@700&display=swap');

  ${EditorStyles}, body {
    font-family: 'Fira Code', monospace;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Space Mono', monospace;
  }
`

const GlobalHackerStyles = css`
  .ModalContent {
    ${hackerBorder};
    background-color: ${grayMainColor};
    border: none;
  }
  .ModalOverlay {
    backdrop-filter: blur(10px);
  }
  button {
    ${hackerBorderThin}
  }
`
export const HackerStyles = css`
  ${GlobalHackerStyles}
  ${HackerFonts}
  ${navStyles}
  ${settingsStyles}
    ${gridCardStyles}
    ${edStyles}
`
