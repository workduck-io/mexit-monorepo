import { CommentStore, IDBStorage } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useCommentStore = create<CommentStore>(
  persist(
    (set, get) => ({
      comments: [],
      clear: () => set({ comments: [] }),
      setComments: (comments) => set({ comments }),
      addNoteComments: (comments, nodeid) =>
        set((state) => ({
          comments: [
            ...state.comments
              .filter((comment) => !comments.find((c) => c.entityId === comment.entityId))
              .filter((comment) => comment.nodeId !== nodeid),
            ...comments
          ]
        }))
    }),

    {
      name: 'mexit-comments-store',
      getStorage: () => IDBStorage
    }
  )
)
