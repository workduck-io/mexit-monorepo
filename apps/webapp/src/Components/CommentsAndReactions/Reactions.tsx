import { Icon } from '@iconify/react'
import { MIcon, mog, Reaction as ReactionType } from '@mexit/core'
import { IconDisplay } from '@mexit/shared'
import { debounce } from 'lodash'
import { reactionsWithCount } from '../../Hooks/useReactions'
import { CompressedReactionGroup, ReactionButton, ReactionCount, ReactionsWrapper } from './Reactions.style'

interface ReactionsProps {
  reactions: ReactionType[]
  onToggleReaction: (reactionVal: MIcon) => void
}

export const Reactions = ({ reactions, onToggleReaction }: ReactionsProps) => {
  const BlockReactions = reactionsWithCount(reactions)
  const toggleReaction = (reactionVal: MIcon) => {
    onToggleReaction(reactionVal)
  }

  // if (reactions.length > 0) {
  //   mog('BlockReactions', { BlockReactions, reactions })
  // }

  const onHover = (reaction: MIcon) => {
    mog('onHover we shall fetch details', { reaction })
  }

  const onDelayPerform = debounce(onHover, 500)

  return (
    <ReactionsWrapper>
      {BlockReactions.map((reaction) => (
        <ReactionButton
          onMouseEnter={() => onDelayPerform(reaction.reaction)}
          onClick={() => toggleReaction(reaction.reaction)}
          key={reaction.reaction.value}
        >
          <IconDisplay size={20} icon={reaction.reaction} />
          {reaction.count > 0 && <ReactionCount>{reaction.count}</ReactionCount>}
        </ReactionButton>
      ))}
    </ReactionsWrapper>
  )
}

interface BlockReactionProps {
  previewReactions: {
    reaction: MIcon
    count: number
  }[]
}

export const BlockReaction = ({ previewReactions }: BlockReactionProps) => {
  return previewReactions.length > 0 ? (
    <CompressedReactionGroup>
      {previewReactions.map((r, i) => (
        <IconDisplay key={i} size={12} icon={r.reaction} />
      ))}
    </CompressedReactionGroup>
  ) : (
    <Icon icon="fluent:emoji-add-20-regular" />
  )
}
