import create from 'zustand'

import { IDBStorage, ReactionStore } from '@mexit/core'
import { persist } from 'zustand/middleware'

export const useReactionStore = create<ReactionStore>(
  persist(
    (set) => ({
      reactions: [],
      setReactions: (reactions) => set({ reactions })
    }),
    {
      name: 'mexit-reactions-store',
      getStorage: () => IDBStorage
    }
  )
)
