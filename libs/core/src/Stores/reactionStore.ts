import { Reaction } from '../Types/Reaction'

export interface ReactionStore {
  reactions: Reaction[]
  setReactions: (reactions: Reaction[]) => void
}
