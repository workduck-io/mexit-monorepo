import { NodeEditorContent } from './Editor'

/**
 * A comment
 *
 * The comment is a comment by a user on a block of a specific note.
 * A thread is a sequence of comments given to an initial comment with no threadId
 *
 * Contents are plain editor contents
 */
export interface Comment {
  // ID of the comment
  entityId: string

  // Block to the comment
  blockId: string

  // Note of the block in which comment is made
  nodeId: string

  // Which is the thread
  threadId?: string

  // Who made the comment
  userId: string

  // Contents of the comment
  // Editor Format
  content: NodeEditorContent

  metadata?: {
    createdAt?: number
  }
}

export type APIComment = Omit<Comment, 'userId'>
