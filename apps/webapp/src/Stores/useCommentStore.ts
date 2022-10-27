import create from 'zustand'
import { CommentStore } from '@mexit/core'

export const useCommentStore = create<CommentStore>((set, get) => ({
  comments: [],
  setComments: (comments) => set({ comments })
}))
