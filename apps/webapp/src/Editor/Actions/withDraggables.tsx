import React from 'react'
import styled from 'styled-components'

import Tippy, { TippyProps } from '@tippyjs/react'
import { default as TippyHeadless, TippyProps as TippyHeadlessProps } from '@tippyjs/react/headless'
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_IMAGE,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TABLE,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
  withDraggables
} from '@udecode/plate'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import refreshLine from '@iconify/icons-ri/refresh-line'
import timeLine from '@iconify/icons-ri/time-line'
import { Icon } from '@iconify/react'
import checkboxBlankCircleLine from '@iconify-icons/ri/checkbox-blank-circle-line'
import { ProfileImage } from '../../Components/User/ProfileImage'
import useBlockStore from '../../Stores/useBlockStore'
import { useEditorStore } from '../../Stores/useEditorStore'
import { RelativeTime } from '@mexit/shared'

// import { RelativeTime } from '../../components/mex/RelativeTime'
// import { ProfileImage } from '../../components/mex/User/ProfileImage'
// import { IS_DEV } from '../../data/Defaults/dev_'
// import useBlockStore from '../../store/useBlockStore'
// import { useEditorStore } from '../../store/useEditorStore'
// import { mog } from '../../utils/lib/helper'

const StyledTip = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.tiny} 0;
  color: ${({ theme }) => theme.colors.fade};
  background-color: transparent;
  cursor: pointer;
  border-radius: 0.25rem;
`

export const StyledDraggable = styled(StyledTip)`
  padding: ${({ theme }) => theme.spacing.tiny};
  background-color: ${({ theme }) => theme.colors.gray[8]};
`

export const ActionDraggableIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.gray[9]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.tiny};
  svg {
    height: 1.2rem;
    width: 1.2rem;
    color: ${({ theme }) => theme.colors.secondary};
  }
`

const MetadataWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: max-content;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  gap: ${({ theme }) => theme.spacing.small};
`

const MetadataRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  svg {
    color: ${({ theme }) => theme.colors.secondary};
  }
  svg:nth-child(2) {
    border-radius: ${({ theme }) => theme.borderRadius.tiny};
  }
`

const MetadataText = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
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
      {/* <Tippy content={`BLOCK: ${props.element.id}`}>
        <ActionDraggableIcon onClick={(ev) => show(ev, { props: { blockId: props.element.id } })}>
          <Icon icon={addLine} />
        </ActionDraggableIcon>
      </Tippy> */}
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
  // duration: [0, 10000000],
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
    </>
  )
}

export const withStyledDraggables = (components: any) => {
  const isBlockMode = useBlockStore.getState().isBlockMode
  const isEditing = useEditorStore.getState().isEditing

  if (isBlockMode || isEditing) return components

  return withDraggables(components, [
    {
      keys: [ELEMENT_PARAGRAPH, ELEMENT_UL, ELEMENT_OL],
      level: 0
    },
    {
      keys: [
        ELEMENT_PARAGRAPH,
        ELEMENT_BLOCKQUOTE,
        ELEMENT_TODO_LI,
        ELEMENT_H1,
        ELEMENT_H2,
        ELEMENT_H3,
        ELEMENT_H4,
        ELEMENT_H5,
        ELEMENT_H6,
        ELEMENT_IMAGE,
        ELEMENT_OL,
        ELEMENT_UL,
        // ELEMENT_SYNC_BLOCK,
        // ELEMENT_INLINE_BLOCK,
        // ELEMENT_ILINK,
        ELEMENT_TABLE,
        ELEMENT_MEDIA_EMBED,
        ELEMENT_CODE_BLOCK
      ],
      onRenderDragHandle: ({ className, styles, element }) => {
        const setIsBlockMode = useBlockStore.getState().setIsBlockMode

        return (
          <Tippy {...grabberTooltipProps} content={<GrabberTooltipContent element={element} />}>
            <Tippy theme="mex" placement="top" content={<DraggerContent element={element} />}>
              {/* eslint-disable-next-line */}
              <StyledDraggable onClick={() => setIsBlockMode(true)} className={className} css={styles}>
                <Icon icon={checkboxBlankCircleLine} />
              </StyledDraggable>
            </Tippy>
          </Tippy>
        )
      }
    },
    {
      key: ELEMENT_H1,
      styles: {
        gutterLeft: {
          alignItems: 'center'
        },
        blockToolbarWrapper: {
          height: '1.3em'
        }
      }
    },
    {
      key: ELEMENT_H2,
      styles: {
        gutterLeft: {
          alignItems: 'center'
        },
        blockToolbarWrapper: {
          height: '1.3em'
        }
      }
    },
    {
      key: ELEMENT_H3,
      styles: {
        gutterLeft: {
          alignItems: 'center'
        },
        blockToolbarWrapper: {
          height: '1.3em'
        }
      }
    },
    {
      keys: [ELEMENT_H4, ELEMENT_H5, ELEMENT_H6],
      styles: {
        gutterLeft: {
          alignItems: 'center'
        },
        blockToolbarWrapper: {
          height: '1.3em'
        }
      }
    },
    {
      keys: [ELEMENT_PARAGRAPH, ELEMENT_UL, ELEMENT_OL],
      styles: {
        gutterLeft: {
          alignItems: 'center'
        }
      }
    },
    {
      key: ELEMENT_BLOCKQUOTE,
      styles: {
        gutterLeft: {
          alignItems: 'center'
        }
      }
    },
    {
      key: ELEMENT_CODE_BLOCK,
      styles: {
        gutterLeft: {
          alignItems: 'center'
        }
      }
    },
    {
      key: ELEMENT_TODO_LI,
      styles: {
        gutterLeft: {
          alignItems: 'center'
        }
      }
    }
  ])
}
