import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { ReactionStore } from '@mexit/core'

export const useReactionStore = create<ReactionStore>(
  devtools(
    persist(
      (set, get) => ({
        reactions: [],
        clear: () => set({ reactions: [] }),
        setReactions: (reactions) => set({ reactions }),
        addNoteReactions: (reactions, nodeid) => {
          // mog('addNoteReactions', { reactions, nodeid })
          set({
            reactions: [...get().reactions.filter((reaction) => reaction.nodeId !== nodeid), ...reactions]
          })
        }
      }),
      {
        name: 'mexit-reactions-store'
      }
    ),
    {
      name: 'mexit-reactions-store-web'
    }
  )
)
