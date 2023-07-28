import React from 'react'

import checkboxBlankCircleLine from '@iconify/icons-radix-icons/drag-handle-dots-2'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import refreshLine from '@iconify/icons-ri/refresh-line'
import timeLine from '@iconify/icons-ri/time-line'
import { Icon } from '@iconify/react'
import Tippy, { TippyProps } from '@tippyjs/react'
import { default as TippyHeadless, TippyProps as TippyHeadlessProps } from '@tippyjs/react/headless'
import { DragHandleProps, withDraggables } from '@udecode/plate'
import styled, { css } from 'styled-components'

import { IS_DEV, SuperBlocks, useBlockStore, useEditorStore } from '@mexit/core'
import { ProfileImage, RelativeTime } from '@mexit/shared'

const StyledTip = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.tiny} 0;
  color: ${({ theme }) => theme.tokens.text.fade};
  background-color: transparent;
  cursor: pointer;
  border-radius: 0.25rem;
`

export const StyledDraggable = styled(StyledTip)<{ show?: boolean }>`
  display: none;
  padding: ${({ theme }) => theme.spacing.tiny};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[4]};

  ${({ show }) =>
    show &&
    css`
      display: flex;
    `}
`

export const ActionDraggableIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.tiny};
  svg {
    height: 1.2rem;
    width: 1.2rem;
    color: ${({ theme }) => theme.tokens.colors.secondary};
  }
`

const MetadataWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: max-content;
  background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  gap: ${({ theme }) => theme.spacing.small};
`

const MetadataRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  svg {
    color: ${({ theme }) => theme.tokens.colors.secondary};
  }
  svg:nth-child(2) {
    border-radius: ${({ theme }) => theme.borderRadius.tiny};
  }
`

const MetadataText = styled.div`
  color: ${({ theme }) => theme.tokens.text.fade};
  flex-grow: 1;
`

const MetadataViewSmall = ({ m }: any) => {
  const tippyProps: TippyProps = {
    theme: 'mex-bright',
    placement: 'right'
  }
  return (
    <MetadataWrap>
      <MetadataRow>
        <Icon icon={addCircleLine} width={16} />
        {m.createdBy !== undefined ? <ProfileImage email={m.createdBy} size={16} /> : null}
        {m.createdAt !== undefined && (
          <MetadataText>
            <RelativeTime dateNum={m.createdAt} tippy tippyProps={tippyProps} />
          </MetadataText>
        )}
      </MetadataRow>
      <MetadataRow>
        <Icon icon={refreshLine} width={16} />

        {m.lastEditedBy !== undefined ? <ProfileImage email={m.lastEditedBy} size={16} /> : null}
        {m.updatedAt !== undefined && (
          <MetadataText>
            <RelativeTime dateNum={m.updatedAt} tippy tippyProps={tippyProps} />
          </MetadataText>
        )}
      </MetadataRow>
    </MetadataWrap>
  )
}

const GrabberTooltipContent = (props: any) => {
  const MetadataTooltipProps: TippyHeadlessProps = {
    placement: 'top',
    inertia: true,
    arrow: false,
    delay: [100, 0],
    followCursor: true,
    // duration: [0, 10000000000],
    hideOnClick: false,
    interactive: true
  }

  return (
    <StyledTip>
      {props.element && props.element.metadata ? (
        <TippyHeadless {...MetadataTooltipProps} render={(attrs) => <MetadataViewSmall m={props.element.metadata} />}>
          <ActionDraggableIcon>
            <Icon icon={timeLine} />
          </ActionDraggableIcon>
        </TippyHeadless>
      ) : null}
    </StyledTip>
  )
}

export const grabberTooltipProps: TippyProps = {
  placement: 'left',
  inertia: true,
  arrow: false,
  delay: [100, 0],
  followCursor: true,
  appendTo: () => document.body,
  hideOnClick: false,
  interactive: true,
  theme: 'transparent'
}

export const DraggerContent = ({ element }: any) => {
  return (
    <>
      <div>Drag to move</div>
      <div>Click to select</div>
      {IS_DEV && (
        <div>
          <span>
            <i>{element && element.id}</i> - {element && element.type}
          </span>
        </div>
      )}
    </>
  )
}
const DragHandle = ({ className, styles, element }: DragHandleProps) => {
  const isUserTyping = useEditorStore((store) => store.isEditing)
  const setIsBlockMode = useBlockStore.getState().setIsBlockMode

  return (
    <Tippy {...grabberTooltipProps} content={<GrabberTooltipContent element={element} />}>
      <Tippy theme="mex" placement="top" content={<DraggerContent element={element} />}>
        <StyledDraggable onClick={() => setIsBlockMode(true)} className={className} css={styles} show={!isUserTyping}>
          <Icon icon={checkboxBlankCircleLine} />
        </StyledDraggable>
      </Tippy>
    </Tippy>
  )
}

export const withStyledDraggables = (components: any) => {
  const isBlockMode = useBlockStore.getState().isBlockMode
  const isEditing = useEditorStore.getState().isEditing

  if (isBlockMode || isEditing) return components

  return withDraggables(components, [
    {
      keys: Object.values(SuperBlocks),
      level: 0
    },
    {
      keys: Object.values(SuperBlocks),
      onRenderDragHandle: ({ className, styles, element }) => {
        return <DragHandle className={className} styles={styles} element={element} />
      }
    },
    {
      key: SuperBlocks.CONTENT,
      styles: {
        gutterLeft: {
          alignItems: 'center'
        },
        blockToolbarWrapper: {
          height: '1.3em'
        }
      }
    }
  ])
}
