import create from 'zustand'
import { persist } from 'zustand/middleware'
import { CommentStore, IDBStorage } from '@mexit/core'

export const useCommentStore = create<CommentStore>(
  persist(
    (set, get) => ({
      comments: [],
      setComments: (comments) => set({ comments })
    }),

    {
      name: 'mexit-comments-store',
      getStorage: () => IDBStorage
    }
  )
)
