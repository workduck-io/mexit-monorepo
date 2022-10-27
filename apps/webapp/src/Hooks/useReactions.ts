import { useReactionAPI } from './API/useCommentAndReactionAPI'
import { useReactionStore } from '../Stores/useReactionStore'
import { mog, Reaction } from '@mexit/core'

export const useReactions = () => {
  const reactionsAPI = useReactionAPI()
  const reactions = useReactionStore((state) => state.reactions)
  const setReactions = useReactionStore((state) => state.setReactions)

  const addReaction = (reaction: Reaction) => {
    reactionsAPI
      .addReaction(reaction)
      .then((res) => {
        mog('Saved comment', { res })
        setReactions([...reactions, { ...reaction, userId: '' }])
      })
      .catch((err) => {
        mog('Error saving comment', { err })
      })
  }

  const deleteReaction = (reaction: Reaction) => {
    reactionsAPI
      .deleteReaction(reaction)
      .then((res) => {
        mog('Deleted comment', { res })
        setReactions(
          reactions.filter(
            (r) =>
              r.blockId !== reaction.blockId &&
              r.userId !== reaction.userId &&
              r.reaction.value !== reaction.reaction.value
          )
        )
      })
      .catch((err) => {
        mog('Error deleting comment', { err })
      })
  }

  const getAllReactionsOfNode = (nodeId: string) => {
    reactionsAPI
      .getReactionsOfNote(nodeId)
      .then((res) => {
        mog('Got comments', { res })
        // setComments(res)
      })
      .catch((err) => {
        mog('Error getting comments', { err })
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
