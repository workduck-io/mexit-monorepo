import styled, { css } from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

import { EditorStyles } from './Editor'
import { MainHeader } from './Layouts'
import { MainFont, SearchFilterListCurrent } from './Search'
import { TodoContainer, TodoText } from './Todo.style'
import { Title } from './Typography'

/*
 * Todos
 *
 * react-kanban-board
react-kanban-card
react-kanban-card-skeleton
react-kanban-card--dragging
react-kanban-card__description
react-kanban-card__title
react-kanban-column
react-kanban-card-adder-form
react-kanban-card-adder-button
react-kanban-card-adder-form__title
react-kanban-card-adder-form__description
react-kanban-card-adder-form__button
react-kanban-column-header
react-kanban-column-header__button
react-kanban-column-adder-button
 */

export const KANBAN_WIDTH = (sidebarExpanded?: boolean) =>
  `calc(( 100vw - ${sidebarExpanded ? '468px' : '186px'} ) / 3)`
export const KANBAN_HEIGHT = `calc( 100vh - 22rem )`
export const KANBAN_CARD_WIDTH = (sidebarExpanded?: boolean) =>
  `calc(( 100vw - ${sidebarExpanded ? '528px' : '248px'}) / 3)`

export const StyledBoard = styled.div<{ sidebarExpanded?: boolean }>`
  display: flex;
  flex-direction: column;

  gap: ${({ theme }) => theme.spacing.medium};

  .react-kanban-board {
    overflow: hidden;
  }
  .react-kanban-column {
    width: ${({ sidebarExpanded, theme }) =>
      css`calc(${KANBAN_WIDTH(sidebarExpanded)} - ${theme.additional.hasBlocks ? '1.33rem' : '0px'})`};
    max-height: ${KANBAN_HEIGHT};
    overflow-y: auto;
    overflow-x: hidden;
    transition: width 0.5s ease-in-out;
    background: ${({ theme }) => theme.tokens.surfaces.s[2]};
    padding: ${({ theme }) => theme.spacing.small};
    margin: ${({ theme }) => theme.spacing.small};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

export const StyledTasksKanban = styled(StyledBoard)``

export const TaskViewSection = styled.div`
  display: flex;
  flex-direction: column;

  gap: ${({ theme }) => theme.spacing.medium};
`

export const StyledTasksKanbanBlock = styled(StyledBoard)`
  ${SearchFilterListCurrent} {
    padding: ${({ theme }) => theme.spacing.small};
  }
  .react-kanban-column {
    width: calc(100% / 3.2);
  }
  .react-kanban-column > div > div,
  .react-kanban-column > div > div > div {
    width: 100%;
  }
  .react-kanban-board > div {
    width: 100%;
  }
`

export const StyledViewBlockPreview = styled.div`
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
  ${MainFont};
`

export const TaskHeaderTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

export const TaskHeader = styled(MainHeader)`
  margin: ${({ theme }) => theme.spacing.large} 0;
  ${TaskHeaderTitleSection} {
    flex-grow: 1;
  }
  ${TaskHeaderTitleSection} > ${Title} {
    flex-grow: 0;
    margin-right: ${({ theme }) => theme.spacing.medium};
  }
`

export const TaskHeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${({ theme }) => theme.tokens.text.default};
  }
`

export const TaskViewHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

export const TaskViewTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  font-size: 2rem;
  font-weight: bold;

  svg {
    color: ${({ theme }) => theme.tokens.colors.primary.default};
  }
`

export const TaskViewControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

export const ShortcutTokens = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.large}`};
  max-width: 600px;
  justify-content: end;
`

export const ShortcutToken = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => generateStyle(theme.generic.shortcut)};
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
  background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 0.9rem;

  svg {
    width: 1.3rem;
    height: 1.3rem;
    padding: 4px ${({ theme }) => theme.spacing.tiny};
    border-radius: 4px;
    background-color: ${({ theme }) => theme.generic.shortcut.surface};
    color: ${({ theme }) => theme.generic.shortcut.iconColor};
  }
`

export const TaskColumnHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  margin: ${({ theme }) => theme.spacing.medium} 0 ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.tokens.text.fade};
  font-size: 1.5rem;
`

export const TaskCard = styled.div<{
  dragging?: boolean
  selected: boolean
  staticBoard?: boolean
  sidebarExpanded?: boolean
  priorityShown?: boolean
}>`
  ${TodoContainer} {
    width: ${({ sidebarExpanded, theme }) =>
      css`calc(${KANBAN_CARD_WIDTH(sidebarExpanded)} - ${theme.additional.hasBlocks ? '1.33rem' : '0px'})`};
    padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
  }
  width: ${({ sidebarExpanded, theme }) =>
    css`calc(${KANBAN_CARD_WIDTH(sidebarExpanded)} - ${theme.additional.hasBlocks ? '1.33rem' : '0px'})`};
  ${TodoText} {
    max-width: calc(100% - ${({ priorityShown }) => (priorityShown ? '5rem' : '0px')});
    overflow: hidden;
  }
  margin: ${({ theme }) => theme.spacing.tiny} 0;
  background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: width 0.5s ease-in-out;
  ${({ dragging, theme }) =>
    dragging &&
    css`
      background: ${theme.tokens.surfaces.s[4]};
      box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
    `};
  :hover {
    background: ${({ theme }) => theme.tokens.surfaces.s[4]};
    box-shadow: ${({ theme }) => theme.tokens.shadow.small};
  }
  ${({ selected, theme }) =>
    selected &&
    css`
      border: 1px solid ${theme.tokens.colors.primary.default};
    `};

  ${({ staticBoard }) =>
    staticBoard &&
    css`
      width: 100%;
      ${EditorStyles} {
        max-width: 100%;
        overflow: hidden;
      }
      ${TodoContainer} {
        width: 100%;
        max-width: 230px;
      }
    `}
`

export const TaskListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0px;

  ${TodoContainer} {
    width: 100%;
    padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
  }
  ${TodoText} {
    max-width: 100%;
    overflow: hidden;
  }
  ${TaskCard} {
    width: 100%;
  }
`
