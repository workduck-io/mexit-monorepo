import { Reaction } from '../Types/Reaction'

export interface ReactionStore {
  reactions: Reaction[]

  setReactions: (reactions: Reaction[]) => void
  clear: () => void

  // Adds reactions of a note to store,
  // it removes previous reactions of the note
  addNoteReactions: (reactions: Reaction[], nodeid: string) => void
}
