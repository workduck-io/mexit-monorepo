import create from 'zustand'

import { ReactionStore } from '@mexit/core'
import { devtools, persist } from 'zustand/middleware'

export const useReactionStore = create<ReactionStore>(
  devtools(
    persist(
      (set, get) => ({
        reactions: [],
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
