import { useCommentStore } from '../Stores/useCommentStore'
import { useCommentAPI } from './API/useCommentAndReactionAPI'
import { APIComment, Comment, mog } from '@mexit/core'
import { useAuthStore } from '../Stores/useAuth'

export const useComments = () => {
  const commentAPI = useCommentAPI()
  const comments = useCommentStore((state) => state.comments)
  const setComments = useCommentStore((state) => state.setComments)
  const addComments = useCommentStore((state) => state.addNoteComments)

  const addComment = async (comment: APIComment): Promise<void> => {
    const currentUserDetails = useAuthStore.getState().userDetails
    await commentAPI
      .saveComment(comment)
      .then((res) => {
        mog('Saved comment', { res })
        setComments([
          ...comments,
          {
            ...comment,
            userId: currentUserDetails.userID,
            metadata: {
              createdAt: res ? new Date((res as any)?.created).getTime() : new Date().getTime()
            }
          }
        ])
      })
      .catch((err) => {
        mog('Error saving comment', { err })
        throw Error('Error Saving comment')
      })
    return
  }

  const deleteComment = async (nodeid: string, id: string) => {
    await commentAPI
      .deleteComment(nodeid, id)
      .then((res) => {
        // mog('Deleted comment', { res })
        setComments(comments.filter((comment) => comment.entityId !== id))
      })
      .catch((err) => {
        mog('Error deleting comment', { err })
      })
    return
  }

  const getAllCommentsOfNode = (nodeId: string) => {
    commentAPI
      .getCommentsByNodeId(nodeId)
      .then((res) => {
        if (!res) return
        const comments: Comment[] = (Array.isArray(res) ? res : []).map((comment) => {
          return {
            entityId: comment.entityId,
            blockId: comment.blockId,
            nodeId: comment.nodeId,
            threadId: comment.threadId,
            userId: comment.userId,
            content: comment.content,
            metadata: {
              createdAt: comment?.created ? new Date(comment.created).getTime() : undefined
            }
          }
        })
        // mog('Got comments', { res, comments })

        addComments(comments, nodeId)
      })
      .catch((err) => {
        mog('Error getting comments', { err })
      })
  }

  const getCommentsOfBlock = (blockId: string) => {
    return comments.filter((comment) => comment.blockId === blockId)
  }

  return { comments, addComment, deleteComment, getAllCommentsOfNode, getCommentsOfBlock }
}
