import { Comment } from '../Types/Comment'

export interface CommentStore {
  comments: Comment[]

  getCommentsByBlockId(blockId: string): Comment[]
  setComments(comments: Comment[]): void
}
