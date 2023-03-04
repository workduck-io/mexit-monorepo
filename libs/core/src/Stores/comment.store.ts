import { Comment } from '../Types/Comment'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export const commentStoreConfig = (set, get) => ({
  comments: [] as Comment[],
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

export const useCommentStore = createStore(commentStoreConfig, StoreIdentifier.COMMENTS, true);