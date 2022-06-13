import { StyledEditor, NodeInfo, EditorWrapper, EditorStyles, TodoContainer, EditorPreviewWrapper } from '@mexit/shared'
import { transparentize } from 'polished'
import { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components'

import { BalloonToolbarBase } from '../Components/Editor/BalloonToolbar'
import { DataInfobarWrapper } from '../Components/Infobar/DataInfobar'
import { BackCard } from '../Style/Card'
import { ComboboxRoot, ComboboxItem } from '../Style/Combobox'
import { GridWrapper } from '../Style/Grid'
import { NavWrapper } from '../Style/Nav'
import { Result, SearchFilterListWrap } from '../Style/Search'
import { SidebarDiv } from '../Style/Sidebar'
import { SSnippet, CreateSnippet } from '../Style/Snippets'
import { StyledBoard } from '../Style/Todo'
import { ArchivedNode } from '../Views/Archive'
import { SettingsOptions } from '../Views/Settings'

interface SpaceProps {
  containerStyle?: FlattenInterpolation<ThemeProps<DefaultTheme>>
  containerStyleReset?: FlattenInterpolation<ThemeProps<DefaultTheme>>
  heightMain?: string
  blur?: string
}

export const SpaceBlocksCss = (props: SpaceProps) => {
  const { containerStyleReset, heightMain, blur } = props
  const grayMixerTrans = (n: number) => css`
    ${({ theme }) => transparentize(0.33, theme.colors.gray[n])}
  `

  const containerStyle = css`
    ${props.containerStyle};
    ${blur &&
    css`
      backdrop-filter: blur(${blur});
    `}
  `

  const edStyles = css`
    ${StyledEditor} {
      margin: 0 auto;
      padding: 0 3rem;
      height: calc(100vh - 4rem);
    }
    ${NodeInfo} {
      ${containerStyle}
    }
    ${DataInfobarWrapper} {
      margin-top: 0rem;
      height: ${heightMain};
      ${containerStyle}
      margin-top: 0;
    }
    ${EditorWrapper} {
      ${containerStyle}
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
        ${containerStyleReset}
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
        ${containerStyleReset}
      }
    }
    ${StyledBoard} {
      .react-kanban-column {
        ${containerStyle}
      }
    }
  `

  const settingsStyles = css`
    ${SettingsOptions} {
      padding: ${({ theme }) => theme.spacing.medium};
      ${containerStyle}
    }
    ${BackCard} {
      ${containerStyle}
    }
  `

  const gridCardStyles = css`
    ${ArchivedNode}, ${Result} {
      ${containerStyle}
      overflow: hidden;
    }
    ${SSnippet} {
      ${containerStyle}
    }
    ${CreateSnippet} {
      ${containerStyle}
    }
  `

  const navStyles = css`
    ${NavWrapper} {
      margin: 0;
      height: ${heightMain};
      min-height: ${heightMain};
      padding: ${({ theme }) => theme.spacing.small} 0 0;
      ${containerStyle}
    }
    ${GridWrapper} {
      margin: 2rem;
      margin-left: ${({ theme }) => theme.spacing.medium};
      margin-right: -1rem;
      margin-bottom: 0;
      grid-gap: ${({ theme }) => theme.spacing.medium};
    }
  `

  const searchStyles = css`
    ${SearchFilterListWrap} {
      width: -webkit-fill-available;
    }
  `

  const sidebarStyles = css`
    ${SidebarDiv} {
      height: ${heightMain};
      ${containerStyle}
      margin-top: 0;
      padding: 0;
    }
  `

  const modalStyles = css`
    .ModalContent {
      ${containerStyle}
    }
  `
  const mainCss = css`
    ${modalStyles}
    ${navStyles}
  ${sidebarStyles}
  ${settingsStyles}
  ${searchStyles}
  ${gridCardStyles}
  ${edStyles}
  ${todoStyles}
  `
  return mainCss
}
