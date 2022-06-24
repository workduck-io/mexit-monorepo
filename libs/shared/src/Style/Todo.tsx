import { mix, transparentize } from 'polished'
import styled, { css } from 'styled-components'
import { Title } from './Elements'
import { MainHeader } from './Layouts'
import { TodoContainer } from './Todo.style'

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

export const KANBAN_WIDTH = `calc(( 100vw - 468px ) / 3)`
export const KANBAN_HEIGHT = `calc( 100vh - 22rem )`
export const KANBAN_CARD_WIDTH = `calc(( 100vw - 520px ) / 3)`

export const StyledBoard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  .react-kanban-column {
    width: ${KANBAN_WIDTH};
    max-height: ${KANBAN_HEIGHT};
    overflow-y: scroll;
    overflow-x: hidden;
    background: ${({ theme }) => mix(0.5, theme.colors.gray[9], theme.colors.gray[10])};
    padding: ${({ theme }) => theme.spacing.small};
    margin: ${({ theme }) => theme.spacing.small};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

export const StyledTasksKanban = styled(StyledBoard)``

export const TaskHeader = styled(MainHeader)`
  ${Title} {
    flex-grow: 1;
  }
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
  color: ${({ theme }) => theme.colors.gray[4]};
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
  background: ${({ theme }) => theme.colors.gray[9]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 0.9rem;

  svg {
    width: 1.3rem;
    height: 1.3rem;
    padding: 4px ${({ theme }) => theme.spacing.tiny};
    border-radius: 4px;
    background-color: ${({ theme }) => theme.colors.gray[8]};
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const TaskColumnHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  margin: ${({ theme }) => theme.spacing.medium} 0 ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text.fade};
  font-size: 1.5rem;
`

export const TaskCard = styled.div<{ dragging: boolean; selected: boolean }>`
  ${TodoContainer} {
    width: ${KANBAN_CARD_WIDTH};
    padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
  }
  width: ${KANBAN_CARD_WIDTH};
  margin: ${({ theme }) => theme.spacing.tiny} 0;
  background: ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  ${({ dragging, theme }) =>
    dragging &&
    css`
      background: ${theme.colors.gray[7]};
      box-shadow: 0px 4px 10px ${({ theme }) => transparentize(0.75, theme.colors.palette.black)};
      cursor: grab;
    `};
  :hover {
    background: ${({ theme }) => theme.colors.gray[7]};
    box-shadow: 0px 4px 10px ${({ theme }) => transparentize(0.75, theme.colors.palette.black)};
  }
  ${({ selected, theme }) =>
    selected &&
    css`
      border: 1px solid ${theme.colors.primary};
    `};
`
