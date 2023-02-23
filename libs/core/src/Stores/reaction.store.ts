import { Reaction } from '../Types/Reaction'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export interface ReactionStore {
  reactions: Reaction[]

  setReactions: (reactions: Reaction[]) => void
  clear: () => void

  // Adds reactions of a note to store,
  // it removes previous reactions of the note
  addNoteReactions: (reactions: Reaction[], nodeid: string) => void
}

export const reactionStoreConfig = (set, get): ReactionStore => ({
  reactions: [],
  clear: () => set({ reactions: [] }),
  setReactions: (reactions) => set({ reactions }),
  addNoteReactions: (reactions, nodeid) => {
    // mog('addNoteReactions', { reactions, nodeid })
    set({
      reactions: [...get().reactions.filter((reaction) => reaction.nodeId !== nodeid), ...reactions]
    })
  }
})

export const useReactionStore = createStore(reactionStoreConfig, StoreIdentifier.REACTIONS, false)
