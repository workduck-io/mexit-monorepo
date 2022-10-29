import { useCommentStore } from '../Stores/useCommentStore'
import { useCommentAPI } from './API/useCommentAndReactionAPI'
import { APIComment, mog } from '@mexit/core'
import { useAuthStore } from '../Stores/useAuth'

export const useComments = () => {
  const commentAPI = useCommentAPI()
  const comments = useCommentStore((state) => state.comments)
  const setComments = useCommentStore((state) => state.setComments)

  const addComment = async (comment: APIComment): Promise<void> => {
    const currentUserDetails = useAuthStore.getState().userDetails
    await commentAPI
      .saveComment(comment)
      .then((res) => {
        mog('Saved comment', { res })
        setComments([...comments, { ...comment, userId: currentUserDetails.userID }])
      })
      .catch((err) => {
        mog('Error saving comment', { err })
        throw Error('Error Saving comment')
      })
    return
  }

  const deleteComment = (id: string) => {
    commentAPI
      .deleteComment(id)
      .then((res) => {
        mog('Deleted comment', { res })
        setComments(comments.filter((comment) => comment.entityId !== id))
      })
      .catch((err) => {
        mog('Error deleting comment', { err })
      })
  }

  const getAllCommentsOfNode = (nodeId: string) => {
    commentAPI
      .getCommentsByNodeId(nodeId)
      .then((res) => {
        mog('Got comments', { res })
        // setComments(res)
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
