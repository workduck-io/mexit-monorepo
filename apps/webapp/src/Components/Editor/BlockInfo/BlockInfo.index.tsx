import { useMemo, useState } from 'react'

import message2Line from '@iconify/icons-ri/message-2-line'
import { Icon } from '@iconify/react'
import { isSelectionExpanded, isUrl, usePlateEditorRef } from '@udecode/plate'
import { nanoid } from 'nanoid'
import { useFocused, useSelected } from 'slate-react'

import { generateCommentId, MIcon, mog, useAuthStore, useEditorStore, UserReaction } from '@mexit/core'
import { getIconType, Popover } from '@mexit/shared'

import { getNodeIdFromEditor } from '../../../Editor/Utils/helper'
import { useComments } from '../../../Hooks/useComments'
import { useHighlights } from '../../../Hooks/useHighlights'
import { reactionsWithCount, useReactions } from '../../../Hooks/useReactions'
import { useAnalysisStore } from '../../../Stores/useAnalysis'
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
export const BlockInfo = ({ element }) => {
  const selected = useSelected()
  const focused = useFocused()
  const editor = usePlateEditorRef()

  const isUserEditing = useEditorStore((state) => state.isEditing)

  // Whether the element is inline
  const analysis = useAnalysisStore((state) => state.analysis)
  // const isTable = useMemo(() => attributes['data-slate-table'], [attributes])
  const { getCommentsOfBlock, addComment, deleteComment } = useComments()
  const { getReactionsOfBlock, getReactionDetails, addReaction, deleteReaction } = useReactions()
  const { getHighlight } = useHighlights()
  const [instanceId, setInstanceId] = useState<string>(nanoid())

  const selectionExpanded = editor && isSelectionExpanded(editor)

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
    if (analysis?.displayBlocksWithHighlight) {
      if (analysis?.displayBlocksWithHighlight?.includes(element?.id)) {
        return true
      }
    }

    return isUrl(element?.blockMeta?.origin)
  }, [analysis?.displayBlocksWithHighlight, element?.id])

  // Does the element have sourceUrl
  const hasAssociatedHighlight = useMemo(
    () => element?.metadata?.elementMetadata && element?.metadata?.elementMetadata?.type === 'highlightV1',
    [element]
  )

  // Source url
  const sourceURL = useMemo(() => {
    if (hasAssociatedHighlight) {
      // Extract the source from the highlight entity
      const highlightId = element?.metadata?.elementMetadata?.id
      const highlight = getHighlight(highlightId)
      return highlight?.properties?.sourceUrl
    } else if (isUrl(element?.blockMeta?.origin)) {
      return element?.blockMeta?.origin
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
    const userHasComments = !!comments.some((c) => c.userId === currentUserDetail?.id)
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
    const userHasReacted = !!reactions.find((r) => r.userId?.includes(useAuthStore.getState().userDetails?.id))
    return { reactions, previewReactions, userHasReacted }
  }, [element?.id, interactive, hover, instanceId])
  const hasReactions = useMemo(() => reactions.length > 0, [reactions])

  // Whether to show the blockinfo popup beside the block
  const showBlockInfo = useMemo(() => {
    return mergedSelected || (interactive && focused) || hasComments || hasReactions || showSource
  }, [mergedSelected, hasComments, focused, hasReactions, showSource, interactive, instanceId])

  const onToggleReaction = async (reactionVal: MIcon) => {
    // mog('Toggling reaction', { reactionVal, props })
    const nodeid = getNodeIdFromEditor(editor?.id)
    const blockId = element?.id
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
      blockId: element?.id,
      nodeId: getNodeIdFromEditor(editor?.id),
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
    const nodeId = getNodeIdFromEditor(editor?.id)
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
          {showSource && !icon?.mexIcon && <Source source={sourceURL} />}
          {(hasReactions || mergedSelected || interactive || (!interactive && hover)) && (
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
                  e.stopPropagation()
                  mog('HELLO THERE')
                  setInteractive(true)
                }}
              >
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
              <BlockInfoButton onClick={() => setInteractive(true)}>
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
