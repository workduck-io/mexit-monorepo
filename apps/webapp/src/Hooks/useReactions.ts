import { useReactionAPI } from './API/useCommentAndReactionAPI'
import { useReactionStore } from '../Stores/useReactionStore'
import { useAuthStore } from '../Stores/useAuth'
import { mog, APIReaction } from '@mexit/core'

export const useReactions = () => {
  const reactionsAPI = useReactionAPI()
  const reactions = useReactionStore((state) => state.reactions)
  const setReactions = useReactionStore((state) => state.setReactions)

  const addReaction = (reaction: APIReaction) => {
    const currentUserDetails = useAuthStore.getState().userDetails
    reactionsAPI
      .addReaction(reaction)
      .then((res) => {
        mog('Saved reaction', { res })
        setReactions([...reactions, { ...reaction, userId: currentUserDetails.userID }])
      })
      .catch((err) => {
        mog('Error saving reaction', { err })
      })
  }

  const deleteReaction = (reaction: APIReaction) => {
    const currentUserDetails = useAuthStore.getState().userDetails
    reactionsAPI
      .deleteReaction(reaction)
      .then((res) => {
        const newReactions = reactions.filter(
          (r) =>
            !(
              r.blockId === reaction.blockId &&
              r.userId === currentUserDetails.userID &&
              r.reaction.value === reaction.reaction.value
            )
        )
        mog('Deleted reaction', { res, reaction })
        setReactions(newReactions)
      })
      .catch((err) => {
        mog('Error deleting reaction', { err })
      })
  }

  const getAllReactionsOfNode = (nodeId: string) => {
    reactionsAPI
      .getReactionsOfNote(nodeId)
      .then((res) => {
        mog('Got reactions', { res })
        // setComments(res)
      })
      .catch((err) => {
        mog('Error getting reactions', { err })
      })
  }

  const getReactionsOfBlock = (blockId: string) => {
    return reactions.filter((r) => r.blockId === blockId)
  }

  return {
    reactions,
    addReaction,
    deleteReaction,
    getAllReactionsOfNode,
    getReactionsOfBlock
  }
}
