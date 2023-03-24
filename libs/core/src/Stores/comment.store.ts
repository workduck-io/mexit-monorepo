import { Comment } from '../Types/Comment'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

const commentStoreConfig = (set, get) => ({
  comments: [] as Comment[],
  clear: (): void => set({ comments: [] }),
  setComments: (comments: Comment[]): void => set({ comments }),
  addNoteComments: (comments: Comment[], nodeId: string): void =>
    set((state) => ({
      comments: [
        ...state.comments
          .filter((comment) => !comments.find((c) => c.entityId === comment.entityId))
          .filter((comment) => comment.nodeId !== nodeId),
        ...comments
      ]
    }))
})

export const useCommentStore = createStore(commentStoreConfig, StoreIdentifier.COMMENTS, true)
