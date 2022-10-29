import create from 'zustand'

import { IDBStorage, ReactionStore } from '@mexit/core'
import { persist } from 'zustand/middleware'

export const useReactionStore = create<ReactionStore>(
  persist(
    (set, get) => ({
      reactions: [],
      setReactions: (reactions) => set({ reactions }),
      addNoteReactions: (reactions, nodeid) =>
        set({
          reactions: [
            ...get()
              .reactions.filter(
                (reaction) =>
                  !reactions.find(
                    (r) =>
                      // Due to the absence of reaction id, we compare the reaction value and the user id
                      !(
                        r.blockId === reaction.blockId &&
                        r.userId === reaction.userId &&
                        r.reaction.value === reaction.reaction.value
                      )
                  )
              )
              .filter((reaction) => reaction.nodeId !== nodeid),
            ...reactions
          ]
        })
    }),
    {
      name: 'mexit-reactions-store',
      getStorage: () => IDBStorage
    }
  )
)
