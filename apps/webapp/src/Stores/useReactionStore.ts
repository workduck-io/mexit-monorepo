import create from 'zustand'

import { ReactionStore } from '@mexit/core'

export const useReactionStore = create<ReactionStore>((set) => ({
  reactions: [],
  setReactions: (reactions) => set({ reactions })
}))
