import { mog } from '@mexit/core'
import { Source } from '../../SourceInfo'

import { useEffect, useMemo, useState } from 'react'

import { BlockInfoBlockWrapper, BlockInfoButton, BlockInfoWrapper } from './BlockInfo.style'
import { getIconType, Popover } from '@mexit/shared'
import { Icon } from '@iconify/react'
import message2Line from '@iconify/icons-ri/message-2-line'
import { useFocused, useSelected } from 'slate-react'
import { CommentsComponent } from '../../CommentsAndReactions/Comments'
import { Reactions } from '../../CommentsAndReactions/Reactions'
import { useComments } from '../../../Hooks/useComments'
import { useReactions } from '../../../Hooks/useReactions'

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
  const { getCommentsOfBlock } = useComments()
  const { getReactionsOfBlock } = useReactions()

  const [hover, setHover] = useState(false)
  const [interactive, setInteractive] = useState(false)

  const hasMetadata = useMemo(() => element?.blockMeta || element?.metadata?.elementMetadata, [element])
  const sourceURL = useMemo(
    () => element?.blockMeta?.source || element?.metadata?.elementMetadata?.sourceUrl,
    [element]
  )

  const isInline = useMemo(() => attributes['data-slate-inline'], [attributes])

  const comments = useMemo(() => {
    const blockId = element?.id
    const comments = getCommentsOfBlock(blockId)
    // get whether the block has comment
    // And return true
    return comments
  }, [element?.id])
  const hasComments = useMemo(() => comments.length > 0, [comments])

  const reactions = useMemo(() => {
    const blockId = element?.id
    const reactions = getReactionsOfBlock(blockId)
    return reactions
  }, [element?.id])
  const hasReactions = useMemo(() => reactions.length > 0, [reactions])

  const showBlockInfo = useMemo(() => {
    return (selected && focused) || interactive || hasComments || hasReactions || hasMetadata
  }, [selected, hasComments, focused, hasReactions, hasMetadata, interactive])

  const icon = sourceURL && getIconType(sourceURL)

  // mog('BlockInfo', { id: element?.id, selected, element, attributes, isInline, focused, showBlockInfo })

  return (
    <BlockInfoBlockWrapper {...attributes}>
      {children}
      {showBlockInfo && !isInline && (
        <BlockInfoWrapper
          contentEditable={false}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {hasMetadata && !icon?.mexIcon && <Source source={sourceURL} />}
          {(hasReactions || (selected && focused) || interactive || hover) && (
            <Popover
              onClose={() => setInteractive(false)}
              render={(close) => <Reactions reactions={[]} />}
              placement="bottom"
            >
              <BlockInfoButton onClick={() => setInteractive(true)} transparent primary={hasReactions}>
                <Icon icon="fluent:emoji-add-20-regular" />
              </BlockInfoButton>
            </Popover>
          )}
          {(hasComments || hover || (focused && selected) || interactive) && (
            <Popover
              onClose={() => setInteractive(false)}
              render={(close) => <CommentsComponent comments={comments} />}
              placement="bottom"
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
