import { MIcon, mog } from '@mexit/core'
import { Source } from '../../SourceInfo'

import { useEffect, useMemo, useState } from 'react'

import { BlockInfoBlockWrapper, BlockInfoButton, BlockInfoWrapper } from './BlockInfo.style'
import { getIconType, IconDisplay, Popover } from '@mexit/shared'
import { Icon } from '@iconify/react'
import message2Line from '@iconify/icons-ri/message-2-line'
import { useFocused, useSelected } from 'slate-react'
import { CommentsComponent } from '../../CommentsAndReactions/Comments'
import { BlockReaction, Reactions } from '../../CommentsAndReactions/Reactions'
import { useComments } from '../../../Hooks/useComments'
import { reactionsWithCount, useReactions } from '../../../Hooks/useReactions'
import { useAuthStore } from '../../../Stores/useAuth'
import { getNodeIdFromEditor } from '../../../Editor/Utils/helper'
import { isRangeInSameBlock, isSelectionAtBlockStart, isSelectionExpanded } from '@udecode/plate'
import { CompressedReactionGroup } from '../../CommentsAndReactions/Reactions.style'

/**
 *
 * Shows: for the block
 * SourceInfo (if present)
 * Reactions
 * Comment
 */
export const BlockInfo = (props: any) => {
  const { children, element, attributes } = props
  const selected = useSelected()
  const focused = useFocused()

  // Whether the element is inline
  // TODO: Find a way to only show this for first level blocks only
  const isInline = useMemo(() => attributes['data-slate-inline'], [attributes])
  const { getCommentsOfBlock, addComment } = useComments()
  const { getReactionsOfBlock, addReaction, deleteReaction } = useReactions()

  const selectionExpanded = props?.editor && isSelectionExpanded(props?.editor)
  // const selectionAtStart = props?.editor && isSelectionAtBlockStart(props?.editor)
  //
  // TODO: Fix check of whether the selection is inside a single block
  // const inSingleBlock = props?.editor?.selection && isRangeInSameBlock(props?.editor?.selection)

  const mergedSelected = selectionExpanded ? false : selected

  // Whether to show all elements when hovering over the fixed blockinfo
  // For example: when only source is present
  const [hover, setHover] = useState(false)

  // For retaining the opened state of the blockinfo
  // when displaying the popups for comments and reactions
  const [interactive, setInteractive] = useState(false)

  // Source url
  const hasMetadata = useMemo(() => element?.blockMeta || element?.metadata?.elementMetadata, [element])
  const sourceURL = useMemo(
    () => element?.blockMeta?.source || element?.metadata?.elementMetadata?.sourceUrl,
    [element]
  )
  const icon = sourceURL && getIconType(sourceURL)

  // Comments of the block
  const comments = useMemo(() => {
    const blockId = element?.id
    const comments = getCommentsOfBlock(blockId)
    // get whether the block has comment
    // And return true
    return comments
  }, [element?.id, interactive, hover])
  const hasComments = useMemo(() => comments.length > 0, [comments])

  // Reactions of the block
  const { reactions, previewReactions } = useMemo(() => {
    const blockId = element?.id
    const reactions = getReactionsOfBlock(blockId)
    const previewReactions = reactionsWithCount(reactions)
      .sort((a, b) => b.count - a.count)
      .filter((r) => r.count > 0)
      .slice(0, 3)
    mog('previewReactions', { previewReactions, reactions })
    return { reactions, previewReactions }
  }, [element?.id, interactive, hover])
  const hasReactions = useMemo(() => reactions.length > 0, [reactions])

  // Whether to show the blockinfo popup beside the block
  const showBlockInfo = useMemo(() => {
    return (mergedSelected && focused) || interactive || hasComments || hasReactions || hasMetadata
  }, [mergedSelected, hasComments, focused, hasReactions, hasMetadata, interactive])

  // if (hasReactions) {
  //   mog('BlockInfo', { reactions, hasComments, hasReactions })
  // }

  const onToggleReaction = (reactionVal: MIcon) => {
    // mog('Toggling reaction', { reactionVal, props })
    const nodeid = getNodeIdFromEditor(props?.editor?.id)
    const blockId = element?.id
    const currentUserDetail = useAuthStore.getState().userDetails
    // console.log('Reacting with', reactionVal)
    const existingUserReaction = reactions.find(
      (r) => r.userId === currentUserDetail.userID && r.reaction.value === reactionVal.value
    )
    if (existingUserReaction) {
      deleteReaction(existingUserReaction)
    } else {
      addReaction({
        nodeId: nodeid,
        blockId,
        reaction: reactionVal
      })
    }
  }
  // mog('BlockInfo', {
  //   id: element?.id,
  //   ed: props?.editor,
  //   focused,
  //   showBlockInfo,
  //   // inSingleBlock,
  //   edSel: props?.editor?.selection
  // })

  return (
    <BlockInfoBlockWrapper {...attributes}>
      {children}
      {showBlockInfo && !isInline && (
        <BlockInfoWrapper
          contentEditable={false}
          className="slate-block-info"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {hasMetadata && !icon?.mexIcon && <Source source={sourceURL} />}
          {(hasReactions || (mergedSelected && focused) || interactive || hover) && (
            <Popover
              onClose={() => setInteractive(false)}
              render={() => <Reactions onToggleReaction={onToggleReaction} reactions={reactions} />}
              placement="bottom-end"
            >
              <BlockInfoButton onClick={() => setInteractive(true)} transparent={!hasReactions}>
                <BlockReaction previewReactions={previewReactions} />
              </BlockInfoButton>
            </Popover>
          )}
          {(hasComments || hover || interactive || (focused && mergedSelected)) && (
            <Popover
              onClose={() => setInteractive(false)}
              render={() => (
                <CommentsComponent
                  comments={comments}
                  onAddComment={(content) => {
                    mog('Adding comment', { content })
                    // Add the content to comment
                  }}
                />
              )}
              placement="bottom-end"
            >
              <BlockInfoButton transparent primary={hasComments}>
                <Icon icon={message2Line} />
              </BlockInfoButton>
            </Popover>
          )}
        </BlockInfoWrapper>
      )}
    </BlockInfoBlockWrapper>
  )
}
