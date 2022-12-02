import { useMemo, useState } from 'react'

import message2Line from '@iconify/icons-ri/message-2-line'
import { Icon } from '@iconify/react'
import { findNodePath, isSelectionExpanded } from '@udecode/plate'
import { nanoid } from 'nanoid'
import { useFocused, useSelected } from 'slate-react'

import { generateCommentId, MIcon, UserReaction } from '@mexit/core'
import { getIconType, Popover } from '@mexit/shared'

import { getNodeIdFromEditor } from '../../../Editor/Utils/helper'
import { useReactionAPI } from '../../../Hooks/API/useCommentAndReactionAPI'
import { useComments } from '../../../Hooks/useComments'
import { useHighlights } from '../../../Hooks/useHighlights'
import { reactionsWithCount, useReactions } from '../../../Hooks/useReactions'
import { useAnalysisStore } from '../../../Stores/useAnalysis'
import { useAuthStore } from '../../../Stores/useAuth'
import { useEditorStore } from '../../../Stores/useEditorStore'
import { CommentsComponent } from '../../CommentsAndReactions/Comments'
import { BlockReaction, Reactions } from '../../CommentsAndReactions/Reactions'
import { Source } from '../../SourceInfo'

import { BlockInfoBlockWrapper, BlockInfoButton, BlockInfoWrapper } from './BlockInfo.style'

/**
 *
 * Shows: for the block
 * SourceInfo (if present)
 * Reactions
 * Comment
 */
export const BlockInfo = (props: any) => {
  const { children, element, attributes, editor } = props
  const selected = useSelected()
  const focused = useFocused()

  const path = useMemo(() => findNodePath(editor, element), [editor, element])
  const isNested = useMemo(() => path && 0 !== path.length - 1, [path])
  const isUserEditing = useEditorStore((state) => state.isEditing)

  // Whether the element is inline
  // TODO: Find a way to only show this for first level blocks only
  const isInline = useMemo(() => attributes['data-slate-inline'], [attributes])
  const anal = useAnalysisStore((state) => state.analysis)
  // const isTable = useMemo(() => attributes['data-slate-table'], [attributes])
  const { getCommentsOfBlock, addComment, deleteComment } = useComments()
  const { getReactionsOfBlock, getReactionDetails, addReaction, deleteReaction } = useReactions()
  const { getHighlight } = useHighlights()
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

  // Whether to show source info
  const showSource = useMemo(() => {
    if (anal?.displayBlocksWithHighlight) {
      if (anal?.displayBlocksWithHighlight?.includes(element?.id)) {
        return true
      }
    }
    return false
  }, [anal?.displayBlocksWithHighlight, element?.id])

  // Does the element have sourceUrl
  const hasAssociatedHighlight = useMemo(
    () => element?.metadata?.elementMetadata && element?.metadata?.elementMetadata?.type === 'highlightV1',
    [element]
  )

  // Source url
  const sourceURL = useMemo(() => {
    if (!hasAssociatedHighlight) {
      return undefined
    } else {
      // Extract the source from the highlight entity
      const highlightId = element?.metadata?.elementMetadata?.id
      const highlight = getHighlight(highlightId)
      return highlight?.properties?.sourceUrl
    }
  }, [element, hasAssociatedHighlight])

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
    return (mergedSelected && focused) || interactive || hasComments || hasReactions || showSource
  }, [mergedSelected, hasComments, focused, hasReactions, showSource, interactive, instanceId])

  const onToggleReaction = async (reactionVal: MIcon) => {
    // mog('Toggling reaction', { reactionVal, props })
    const nodeid = getNodeIdFromEditor(props?.editor?.id)
    const blockId = element?.id
    const currentUserDetail = useAuthStore.getState().userDetails
    const existingUserReaction = reactions.find(
      (r) => r.userId?.includes(currentUserDetail.userID) && r.reaction.value === reactionVal.value
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

  // Do not wrap the blockinfo around the inline / nested elements
  return isInline || isNested ? (
    children
  ) : (
    <BlockInfoBlockWrapper {...attributes}>
      {children}
      {showBlockInfo && !isInline && (
        <BlockInfoWrapper
          animate={!isUserEditing}
          contentEditable={false}
          className="slate-block-info"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {showSource && !icon?.mexIcon && <Source source={sourceURL} />}
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
              <BlockInfoButton onClick={() => setInteractive(true)} transparent={!userHasComments}>
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
