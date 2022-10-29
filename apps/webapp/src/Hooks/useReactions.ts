import { useReactionAPI } from './API/useCommentAndReactionAPI'
import { useReactionStore } from '../Stores/useReactionStore'
import { useAuthStore } from '../Stores/useAuth'
import { mog, APIReaction, MIcon, Reaction } from '@mexit/core'

export const defaultReactions: MIcon[] = [
  {
    type: 'EMOJI',
    value: '👍'
  },
  {
    type: 'EMOJI',
    value: '👎'
  },
  {
    type: 'EMOJI',
    value: '😂'
  },
  {
    type: 'EMOJI',
    value: '😮'
  },
  {
    type: 'EMOJI',
    value: '😢'
  },
  {
    type: 'EMOJI',
    // fire emoji
    value: '🔥'
  }
]

export const reactionsWithCount = (reactions: Reaction[]) => {
  return defaultReactions.map((reaction) => {
    const count = reactions.filter((r) => r.reaction.value === reaction.value)
    return { reaction: reaction, count: count.length }
  })
}

export const useReactions = () => {
  const reactionsAPI = useReactionAPI()
  const reactions = useReactionStore((state) => state.reactions)
  const setReactions = useReactionStore((state) => state.setReactions)
  const addReactions = useReactionStore((state) => state.addNoteReactions)

  const addReaction = async (reaction: APIReaction) => {
    const currentUserDetails = useAuthStore.getState().userDetails
    await reactionsAPI
      .addReaction(reaction)
      .then((res) => {
        mog('Saved reaction', { res })
        setReactions([...reactions, { ...reaction, userId: currentUserDetails.userID }])
      })
      .catch((err) => {
        mog('Error saving reaction', { err })
      })
    return
  }

  const deleteReaction = async (reaction: APIReaction) => {
    const currentUserDetails = useAuthStore.getState().userDetails
    await reactionsAPI
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
    return
  }

  const getAllReactionsOfNode = (nodeId: string) => {
    reactionsAPI
      .getReactionsOfNote(nodeId)
      .then((res) => {
        if (!res) return
        const reactions = Object.entries(res)
          .map(([blockId, reactions]) => {
            return reactions.map((reaction: any) => ({
              blockId,
              nodeId,
              // If the user is true, current user added the reaction
              userId: reaction.user ? useAuthStore.getState().userDetails.userID : undefined,
              reaction: {
                type: reaction?.reaction?.split('_')[0],
                value: reaction?.reaction?.split('_')[1]
              }
            }))
          })
          .flat()
        mog('Got reactions', { res, reactions })
        addReactions(reactions, nodeId)
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
