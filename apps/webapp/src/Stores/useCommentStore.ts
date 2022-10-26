import create from 'zustand'
import { CommentStore } from '@mexit/core'

export const useCommentStore = create<CommentStore>((set, get) => ({
  comments: [],
  getCommentsByBlockId: (blockId) => {
    return get().comments.filter((comment) => comment.blockId === blockId)
  },
  setComments: (comments) => set({ comments })
}))
