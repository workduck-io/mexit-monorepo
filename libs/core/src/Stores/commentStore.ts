import { Comment } from '../Types/Comment'

export interface CommentStore {
  comments: Comment[]

  setComments(comments: Comment[]): void
}
