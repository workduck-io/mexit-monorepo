import React from 'react'
import { Reaction as ReactionType } from '@mexit/core'
import { IconDisplay } from '@mexit/shared'

interface ReactionsProps {
  reactions: ReactionType[]
}
export const Reactions = ({ reactions }: ReactionsProps) => {
  return (
    <div>
      <p>Reactions</p>
      {reactions.map((reaction) => (
        <div key={reaction.reaction.value}>
          <IconDisplay icon={reaction.reaction} />
        </div>
      ))}
    </div>
  )
}
