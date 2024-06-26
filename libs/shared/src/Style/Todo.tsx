import styled, { css } from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

import { fadeIn } from './fade'
import { ScrollStyles } from './Helpers'
import { Group, MainHeader } from './Layouts'
import { Ellipsis } from './NodeSelect.style'
import { MainFont } from './Search'
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
export const KANBAN_HEIGHT = `calc(100vh - 16rem)`
export const KANBAN_CARD_WIDTH = (sidebarExpanded?: boolean) =>
  `calc(( 100vw - ${sidebarExpanded ? '528px' : '248px'}) / 3)`

export const StyledBoard = styled.div<{ sidebarExpanded?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};

  .react-kanban-board {
    max-width: ${({ sidebarExpanded }) => `calc(100vw - ${sidebarExpanded ? '420px' : '140px'})`};
    max-height: 80vh;
    ${({ theme }) => ScrollStyles(theme.tokens.surfaces.s[0])}
    
    &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    border: 2px solid rgba(0, 0, 0, 0);
    background-clip: content-box;
    min-width: 8px;
    min-height: 8px;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .react-kanban-column:not(:first-of-type) {
    margin-left: ${({ theme }) => theme.spacing.medium};
  }

  .react-kanban-column {
    width: ${({ sidebarExpanded, theme }) =>
      css`calc(${KANBAN_WIDTH(sidebarExpanded)} - ${theme.additional.hasBlocks ? '1.33rem' : '0px'})`};
    max-height: ${KANBAN_HEIGHT};
    overflow-y: auto;
    overflow-x: hidden;
    background: ${({ theme }) => `rgba(${theme.rgbTokens.surfaces.s[3]}, 0.4)`};
    transition: width 0.5s ease-in-out, background-color 2s ease-in-out;
    padding: ${({ theme }) => theme.spacing.medium};
    border-radius: ${({ theme }) => theme.borderRadius.small};

    opacity: 0;

    animation: ${fadeIn} 0.25s;
    animation-fill-mode: forwards;
  }
`

export const StyledTasksKanban = styled(StyledBoard)`
  margin: ${({ theme }) => theme.spacing.medium} 0;

  [data-rbd-drag-handle-context-id] > div {
    width: 100%;
  }
`

export const ViewSection = styled.div`
  display: flex;
  flex-direction: column;

  gap: ${({ theme }) => theme.spacing.medium};
`

export const StyledTasksKanbanBlock = styled(StyledBoard)`
  overflow: hidden auto;
  max-height: 40vh;

  .react-kanban-column {
    width: calc(100% / 3) !important;
  }

  .react-kanban-column > div > div,
  .react-kanban-column > div > div > div {
    width: 100%;
  }
  .react-kanban-board > div {
    width: 100%;
    max-height: 35vh;
  }
`

export const StyledViewBlockPreview = styled.div`
  ${MainFont};

  ${Group} {
    width: 100%;
  }
`

export const TaskHeaderTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

export const TaskHeader = styled(MainHeader)`
  margin: ${({ theme }) => theme.spacing.small} 0;
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

  width: 100%;
  span {
    max-width: 30ch;
    ${Ellipsis}
  }

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
  pointer-events: none;
  align-items: center;
  ${({ theme }) => generateStyle(theme.generic.shortcut)};
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
  background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 0.9rem;

  pointer-events: none;

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
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`

export const TaskCard = styled.div<{
  priorityShown?: boolean
}>`
  ${TodoText} {
    max-width: calc(100% - ${({ priorityShown }) => (priorityShown ? '5rem' : '0px')});
    overflow: hidden;
  }
`

export const TaskListWrapper = styled.div<{ margin?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.medium};

  margin: ${({ theme }) => theme.spacing.medium} 0;

  ${({ margin, theme }) =>
    margin &&
    css`
      margin: 0 ${theme.spacing.tiny};
    `}

  ${TodoContainer} {
    width: 100%;
    /* padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`}; */
  }
  ${TodoText} {
    max-width: 100%;
    overflow: hidden;
  }
  ${TaskCard} {
    width: 100%;
  }
`
