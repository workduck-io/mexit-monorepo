import { transparentize } from 'polished'
import { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components'

import { ArchivedNode } from '../Style/Archive'
import { BalloonToolbarBase } from '../Style/BalloonToolbar.styles'
import { BackCard } from '../Style/Card'
import { ComboboxRoot, ComboboxItem } from '../Style/Combobox'
import { DataInfobarWrapper } from '../Style/DataInfobar'
import { StyledEditor, EditorStyles } from '../Style/Editor'
import { EditorPreviewWrapper } from '../Style/EditorPreview.styles'
import { GridWrapper } from '../Style/Grid'
import { InfobarTools, InfoBarWrapper } from '../Style/Infobar'
import { ServiceCard } from '../Style/Integrations'
import { NavWrapper, SideNav } from '../Style/Nav'
import { ReminderStyled } from '../Style/Reminders.style'
import { Result, SearchFilterListWrap } from '../Style/Search'
import { SettingsOptions } from '../Style/Settings'
import { SidebarDiv } from '../Style/Sidebar'
import { SSnippet, CreateSnippet } from '../Style/Snippets'
import { StyledBoard } from '../Style/Todo'
import { TodoContainer } from '../Style/Todo.style'

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

  // const NeoContainer = css`
  //   background-color: ${palette.body};
  //   box-shadow: 0px 15px 40px ${({ theme }) => transparentize(0.9, theme.colors.palette.black)};
  // `

  const graphStyles = css`
    ${InfobarTools} {
      margin: 0 0;
    }
    ${InfoBarWrapper} {
      overflow: auto;
    }
  `

  const edStyles = css`
    ${StyledEditor} {
      margin: 0 auto;
      padding-top: 1rem;
      ${containerStyle}
    }
    ${DataInfobarWrapper} {
      margin-top: 0rem;
      margin-top: 0;
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

  const integrationStyles = css`
    ${ServiceCard} {
      ${containerStyle}
    }
  `

  const navStyles = css`
    ${NavWrapper} {
      margin: 0;
      height: ${heightMain};
      min-height: ${heightMain};
    }
    ${SideNav} {
      padding: 0;
      border-radius: ${({ theme }) => theme.borderRadius.small};
      height: ${heightMain};
      min-height: ${heightMain};
    }
    ${GridWrapper} {
      width: 100vw;
      padding: 2rem 1rem;
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

  const remindersStyles = css`
    ${ReminderStyled} {
      ${containerStyle}
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
  ${integrationStyles}
  ${searchStyles}
  ${gridCardStyles}
  ${edStyles}
  ${graphStyles}
  ${todoStyles}
  ${remindersStyles}
  `
  return mainCss
}
