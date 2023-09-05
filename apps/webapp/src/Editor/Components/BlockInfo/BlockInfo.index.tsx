import React, { useMemo, useState } from 'react'

import message2Line from '@iconify/icons-ri/message-2-line'
import { Icon } from '@iconify/react'
import { nanoid } from 'nanoid'

import { generateCommentId, getNodeIdFromEditor, MIcon, useAuthStore, useEditorStore, UserReaction } from '@mexit/core'
import { DefaultMIcons, IconDisplay, Popover, reactionsWithCount, useComments, useReactions } from '@mexit/shared'

import { CommentsComponent } from '../../../Components/CommentsAndReactions/Comments'
import { BlockReaction, Reactions } from '../../../Components/CommentsAndReactions/Reactions'

import { BlockInfoBlockWrapper, BlockInfoButton, BlockInfoWrapper } from './BlockInfo.style'

interface IBlockInfo {
  id: string
  parent: string // Parnet of this Block
  isSelected?: boolean
  isFocused?: boolean
  onDelete?: () => void
}

/**
 *
 * Shows: for the block
 * SourceInfo (if present)
 * Reactions
 * Comment
 */
export const BlockInfo: React.FC<IBlockInfo> = ({ id, parent, onDelete, isSelected, isFocused }) => {
  // Whether to show all elements when hovering over the fixed blockinfo
  // For example: when only source is present
  const [hover, setHover] = useState(false)
  const [instanceId, setInstanceId] = useState<string>(nanoid())

  // For retaining the opened state of the blockinfo
  // when displaying the popups for comments and reactions
  const [interactive, setInteractive] = useState(false)

  const isUserEditing = useEditorStore((state) => state.isEditing)

  const { getCommentsOfBlock, addComment, deleteComment } = useComments()
  const { getReactionsOfBlock, getReactionDetails, addReaction, deleteReaction } = useReactions()

  // Comments of the block
  const { comments } = useMemo(() => {
    const blockId = id
    const comments = getCommentsOfBlock(blockId)
    const currentUserDetail = useAuthStore.getState().userDetails
    const userHasComments = !!comments.some((c) => c.userId === currentUserDetail?.id)

    return { comments, userHasComments }
  }, [id, interactive, hover, instanceId])

  const hasComments = useMemo(() => comments.length > 0, [comments])

  // Reactions of the block
  const { reactions, previewReactions } = useMemo(() => {
    const blockId = id
    const reactions = getReactionsOfBlock(blockId)
    const previewReactions = reactionsWithCount(reactions)
      .sort((a, b) => b.count - a.count)
      .filter((r) => r.count > 0)
      .slice(0, 3)
    // mog('previewReactions', { previewReactions, reactions })
    const userHasReacted = !!reactions.find((r) => r.userId?.includes(useAuthStore.getState().userDetails?.id))
    return { reactions, previewReactions, userHasReacted }
  }, [id, interactive, hover, instanceId])
  const hasReactions = useMemo(() => reactions.length > 0, [reactions])

  // Whether to show the blockinfo popup beside the block
  const showBlockInfo = useMemo(() => {
    return isSelected || (interactive && isFocused) || hasComments || hasReactions
  }, [isSelected, hasComments, isFocused, hasReactions, interactive, instanceId])

  const onToggleReaction = async (reactionVal: MIcon) => {
    // mog('Toggling reaction', { reactionVal, props })
    const nodeid = getNodeIdFromEditor(parent)
    const blockId = id
    const currentUserDetail = useAuthStore.getState().userDetails
    const existingUserReaction = reactions.find(
      (r) => r.userId?.includes(currentUserDetail.id) && r.reaction.value === reactionVal.value
    )
    if (existingUserReaction) {
      await deleteReaction(existingUserReaction)
    } else {
      await addReaction({
        nodeId: nodeid,
        blockId,
        reaction: reactionVal
      })
    }
    setInstanceId(nanoid())
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
      blockId: id,
      nodeId: getNodeIdFromEditor(parent),
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
    const blockId = id
    const nodeId = getNodeIdFromEditor(parent)
    const userReactions = await getReactionDetails(blockId, nodeId)
    return userReactions as UserReaction[]
  }

  return (
    <BlockInfoBlockWrapper>
      {showBlockInfo && (
        <BlockInfoWrapper
          animate={!isUserEditing}
          contentEditable={false}
          className="slate-block-info"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {/* {showSource && !icon?.mexIcon && <Source source={sourceURL} />} */}
          {(hasReactions || isSelected || interactive || (!interactive && hover)) && (
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
              <BlockInfoButton
                onClick={(e) => {
                  setInteractive(true)
                }}
              >
                <BlockReaction previewReactions={previewReactions} />
              </BlockInfoButton>
            </Popover>
          )}
          {(hasComments || (!interactive && hover) || interactive || (isFocused && isSelected)) && (
            <Popover
              onClose={() => setInteractive(false)}
              render={({ close }) => (
                <CommentsComponent comments={comments} onAddComment={onAddComment} onDeleteComment={onDeleteComment} />
              )}
              placement="bottom-end"
              transparent
            >
              <BlockInfoButton onClick={() => setInteractive(true)}>
                <Icon icon={message2Line} />
                {hasComments && comments.length}
              </BlockInfoButton>
            </Popover>
          )}

          {onDelete && (
            <BlockInfoButton onClick={onDelete}>
              <IconDisplay icon={DefaultMIcons.DELETE} />
            </BlockInfoButton>
          )}
        </BlockInfoWrapper>
      )}
    </BlockInfoBlockWrapper>
  )
}
