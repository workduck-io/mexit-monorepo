import { Comment } from '../Types/Comment'

export interface CommentStore {
  comments: Comment[]

  setComments(comments: Comment[]): void
  clear: () => void

  // Adds comments of a note to store,
  // it removes previous comments of the note
  addNoteComments(comments: Comment[], nodeid: string): void
}
