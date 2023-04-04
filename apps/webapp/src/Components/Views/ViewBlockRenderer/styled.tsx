import styled, { css } from 'styled-components'

import { ViewType } from '@mexit/core'
import { BodyFont, EditorStyles, fadeIn, KANBAN_CARD_WIDTH, TodoContainer } from '@mexit/shared'

export const ViewBlockContainer = styled.div<{
  dragging?: boolean
  selected: boolean
  staticBoard?: boolean
  sidebarExpanded?: boolean
  viewType?: ViewType
}>`
  box-sizing: border-box;
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};

  ${BodyFont}

  width: ${({ sidebarExpanded, theme, viewType }) =>
    viewType !== ViewType.Kanban
      ? '100%'
      : css`calc(${KANBAN_CARD_WIDTH(sidebarExpanded)} - ${theme.additional.hasBlocks ? '1.33rem' : '0px'})`};

  margin: ${({ theme }) => theme.spacing.tiny} 0;
  background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: width 0.5s ease-in-out;
  animation: ${fadeIn} 0.5s ease-in-out;
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
  width: 100%;
`

export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  width: 100%;

  img {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    max-height: 300px;
    max-width: 100%;
    height: auto;
    object-fit: contain;
    image-rendering: optimizeQuality;
  }
`

export const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`
