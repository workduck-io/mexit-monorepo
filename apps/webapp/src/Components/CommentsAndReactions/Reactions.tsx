import { MIcon, mog, Reaction as ReactionType } from '@mexit/core'
import { IconDisplay } from '@mexit/shared'
import { ReactionButton, ReactionCount, ReactionsWrapper } from './Reactions.style'

interface ReactionsProps {
  reactions: ReactionType[]
  onToggleReaction: (reactionVal: MIcon) => void
}

const defaultReactions: MIcon[] = [
  {
    type: 'EMOJI',
    value: '👍'
  },
  {
    type: 'EMOJI',
    value: '👎'
  },
  {
    type: 'EMOJI',
    value: '😂'
  },
  {
    type: 'EMOJI',
    value: '😮'
  },
  {
    type: 'EMOJI',
    value: '😢'
  },
  {
    type: 'EMOJI',
    // fire emoji
    value: '🔥'
  }
]

export const Reactions = ({ reactions, onToggleReaction }: ReactionsProps) => {
  const BlockReactions = defaultReactions.map((reaction) => {
    const count = reactions.filter((r) => r.reaction.value === reaction.value)
    return { reaction: reaction, count: count.length }
  })

  const toggleReaction = (reactionVal: MIcon) => {
    onToggleReaction(reactionVal)
  }

  if (reactions.length > 0) {
    mog('BlockReactions', { BlockReactions, reactions })
  }

  return (
    <ReactionsWrapper>
      {BlockReactions.map((reaction) => (
        <ReactionButton onClick={() => toggleReaction(reaction.reaction)} key={reaction.reaction.value}>
          <IconDisplay icon={reaction.reaction} />
          {reaction.count > 0 && <ReactionCount>{reaction.count}</ReactionCount>}
        </ReactionButton>
      ))}
    </ReactionsWrapper>
  )
}
