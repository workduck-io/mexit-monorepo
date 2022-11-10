import { generateCommentId, MIcon, mog, UserReaction } from '@mexit/core'
import { Source } from '../../SourceInfo'

import { useMemo, useState } from 'react'

import message2Line from '@iconify/icons-ri/message-2-line'
import { Icon } from '@iconify/react'
import { getIconType, Popover, StringToMIcon } from '@mexit/shared'
import { isSelectionExpanded } from '@udecode/plate'
import { nanoid } from 'nanoid'
import { useFocused, useSelected } from 'slate-react'
import { getNodeIdFromEditor } from '../../../Editor/Utils/helper'
import { useComments } from '../../../Hooks/useComments'
import { reactionsWithCount, useReactions } from '../../../Hooks/useReactions'
import { useAuthStore } from '../../../Stores/useAuth'
import { CommentsComponent } from '../../CommentsAndReactions/Comments'
import { useReactionAPI } from '../../../Hooks/API/useCommentAndReactionAPI'
import { BlockReaction, Reactions } from '../../CommentsAndReactions/Reactions'
import { BlockInfoBlockWrapper, BlockInfoButton, BlockInfoWrapper } from './BlockInfo.style'

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
  const { getCommentsOfBlock, addComment, deleteComment } = useComments()
  const { getReactionsOfBlock, getReactionDetails, addReaction, deleteReaction } = useReactions()
  const { getBlockReactionDetails } = useReactionAPI()
  const [instanceId, setInstanceId] = useState<string>(nanoid())

  const selectionExpanded = props?.editor && isSelectionExpanded(props?.editor)
  // const selectionAtStart = props?.editor && isSelectionAtBlockStart(props?.editor)

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
  const { comments, userHasComments } = useMemo(() => {
    const blockId = element?.id
    const comments = getCommentsOfBlock(blockId)
    const currentUserDetail = useAuthStore.getState().userDetails
    // get whether the block has comment
    // And return true
    // mog('getting comments', { comments, instanceId })
    const userHasComments = !!comments.some((c) => c.userId === currentUserDetail?.userID)
    return { comments, userHasComments }
  }, [element?.id, interactive, hover, instanceId])

  const hasComments = useMemo(() => comments.length > 0, [comments])

  // Reactions of the block
  const { reactions, previewReactions, userHasReacted } = useMemo(() => {
    const blockId = element?.id
    const reactions = getReactionsOfBlock(blockId)
    const previewReactions = reactionsWithCount(reactions)
      .sort((a, b) => b.count - a.count)
      .filter((r) => r.count > 0)
      .slice(0, 3)
    // mog('previewReactions', { previewReactions, reactions })
    const userHasReacted = !!reactions.find((r) => r.userId?.includes(useAuthStore.getState().userDetails?.userID))
    return { reactions, previewReactions, userHasReacted }
  }, [element?.id, interactive, hover, instanceId])
  const hasReactions = useMemo(() => reactions.length > 0, [reactions])

  // Whether to show the blockinfo popup beside the block
  const showBlockInfo = useMemo(() => {
    return (mergedSelected && focused) || interactive || hasComments || hasReactions || hasMetadata
  }, [mergedSelected, hasComments, focused, hasReactions, hasMetadata, interactive, instanceId])

  const onToggleReaction = (reactionVal: MIcon) => {
    // mog('Toggling reaction', { reactionVal, props })
    const nodeid = getNodeIdFromEditor(props?.editor?.id)
    const blockId = element?.id
    const currentUserDetail = useAuthStore.getState().userDetails
    const existingUserReaction = reactions.find(
      (r) => r.userId?.includes(currentUserDetail.userID) && r.reaction.value === reactionVal.value
    )
    if (existingUserReaction) {
      deleteReaction(existingUserReaction).then(() => {
        setInstanceId(nanoid())
      })
    } else {
      addReaction({
        nodeId: nodeid,
        blockId,
        reaction: reactionVal
      }).then(() => {
        setInstanceId(nanoid())
      })
    }
  }

  const onDeleteComment = async (nodeid: string, commentId: string) => {
    return deleteComment(nodeid, commentId)
      .then(() => {
        setInstanceId(nanoid())
      })
      .catch(() => {
        throw Error('Error adding comment')
      })
  }

  const onAddComment = async (content: any[]) => {
    return addComment({
      entityId: generateCommentId(),
      blockId: element?.id,
      nodeId: getNodeIdFromEditor(props?.editor?.id),
      content
    })
      .then(() => {
        setInstanceId(nanoid())
      })
      .catch(() => {
        throw Error('Error adding comment')
      })
  }

  const getReactionDetailsForBlock = async () => {
    const blockId = element?.id
    const nodeId = getNodeIdFromEditor(props?.editor?.id)
    const userReactions = await getReactionDetails(blockId, nodeId)
    return userReactions as UserReaction[]
  }

  // mog('BlockInfo', {
  //   id: element?.id,
  //   ed: props?.editor,
  //   showBlockInfo,
  //   hasComments,
  //   interactive
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
          {(hasReactions || (mergedSelected && focused) || interactive || (!interactive && hover)) && (
            <Popover
              onClose={() => setInteractive(false)}
              render={() => (
                <Reactions
                  getReactionDetails={getReactionDetailsForBlock}
                  onToggleReaction={onToggleReaction}
                  reactions={reactions}
                />
              )}
              placement="bottom-end"
              transparent
            >
              <BlockInfoButton onClick={() => setInteractive(true)} transparent={!userHasReacted}>
                <BlockReaction previewReactions={previewReactions} />
              </BlockInfoButton>
            </Popover>
          )}
          {(hasComments || (!interactive && hover) || interactive || (focused && mergedSelected)) && (
            <Popover
              onClose={() => setInteractive(false)}
              render={({ close }) => (
                <CommentsComponent comments={comments} onAddComment={onAddComment} onDeleteComment={onDeleteComment} />
              )}
              placement="bottom-end"
              transparent
            >
              <BlockInfoButton onClick={() => setInteractive(true)} transparent primary={userHasComments}>
                <Icon icon={message2Line} />
                {hasComments && comments.length}
              </BlockInfoButton>
            </Popover>
          )}
        </BlockInfoWrapper>
      )}
    </BlockInfoBlockWrapper>
  )
}
