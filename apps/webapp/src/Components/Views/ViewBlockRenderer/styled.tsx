import styled, { css } from 'styled-components'

import { ViewType } from '@mexit/core'
import { EditorStyles, KANBAN_CARD_WIDTH, TodoContainer } from '@mexit/shared'

export const ViewBlockContainer = styled.div<{
  dragging?: boolean
  selected: boolean
  staticBoard?: boolean
  sidebarExpanded?: boolean
  viewType?: ViewType
}>`
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.medium};

  width: ${({ sidebarExpanded, theme, viewType }) =>
    viewType !== ViewType.Kanban
      ? '100%'
      : css`calc(${KANBAN_CARD_WIDTH(sidebarExpanded)} - ${theme.additional.hasBlocks ? '1.33rem' : '0px'})`};

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

  ${({ staticBoard, viewType }) =>
    staticBoard &&
    css`
      width: 100%;
      ${EditorStyles} {
        max-width: 100%;
        overflow: hidden;
      }
      ${TodoContainer} {
        width: 100%;
        ${viewType === ViewType.Kanban && `max-width: 230px;`}
      }
    `}
`