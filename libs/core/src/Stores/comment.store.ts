import { Comment } from '../Types/Comment'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export interface CommentStore {
  comments: Comment[]

  setComments(comments: Comment[]): void
  clear: () => void

  // Adds comments of a note to store,
  // it removes previous comments of the note
  addNoteComments(comments: Comment[], nodeid: string): void
}

export const commentStoreConfig = (set, get) => ({
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
})

const useCommentStore = createStore(commentStoreConfig, StoreIdentifier.COMMENTS, true);

export { useCommentStore }