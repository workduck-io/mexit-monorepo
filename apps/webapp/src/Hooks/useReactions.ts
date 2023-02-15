import { APIReaction, MIcon, mog, Reaction, UserReaction } from '@mexit/core'
import { StringToMIcon } from '@mexit/shared'

import { useAuthStore } from '../Stores/useAuth'
import { useReactionStore } from '../Stores/useReactionStore'

import { useReactionAPI } from './API/useCommentAndReactionAPI'

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
  // mog('reactionsWithCount', { reactions })
  return defaultReactions.map((reaction) => {
    const count = reactions
      .filter((r) => r.reaction.value === reaction.value)
      .map((r) => r.count)
      .reduce((a, b) => a + b, 0)

    const userReacted = reactions
      .find((r) => r.reaction.value === reaction.value)
      ?.userId?.includes(useAuthStore.getState().userDetails?.id ?? '')
    // const userReacted = reactions.find((r) => r.reaction.value === reaction.value)
    return { reaction: reaction, count: count, userReacted }
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
        // Find whether there is a reaction with the same value
        const prevReaction = reactions.find(
          (r) =>
            r.blockId === reaction.blockId &&
            r.nodeId === reaction.nodeId &&
            r.reaction.value === reaction.reaction.value
        )
        // If there is a reaction with the same value, then update the count and append currentUserId
        if (prevReaction) {
          const newReactions = reactions.map((r) => {
            if (
              r.blockId === reaction.blockId &&
              r.nodeId === reaction.nodeId &&
              r.reaction.value === reaction.reaction.value
            ) {
              return {
                ...r,
                count: r.count + 1,
                userId: [...(r.userId ?? []), currentUserDetails.id]
              }
            }
            return r
          })
          setReactions(newReactions)
        } else {
          // Otherwise just append the new reaction
          setReactions([...reactions, { ...reaction, userId: [currentUserDetails.id], count: 1 }])
        }
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
        const newReactions = reactions
          // Filter reactions with only reaction by user
          .filter(
            (r) =>
              !(
                r.blockId === reaction.blockId &&
                r.userId?.includes(currentUserDetails.id) &&
                r.reaction.value === reaction.reaction.value &&
                r.count === 1
              )
          )
          // Remove user from userId array and reduce count by 1 for reactions with more than 1 user
          .map((r) => {
            if (
              r.blockId === reaction.blockId &&
              r.userId?.includes(currentUserDetails.id) &&
              r.reaction.value === reaction.reaction.value &&
              r.count > 1
            ) {
              return { ...r, userId: r.userId?.filter((id) => id !== currentUserDetails.id), count: r.count - 1 }
            }
            return r
          })
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
        const reactions = Object.entries<any>(res)
          .map(([blockId, reactions]) => {
            return reactions.map((reaction: any) => ({
              blockId,
              nodeId,
              // If the user is true, current user added the reaction
              userId: reaction.user ? [useAuthStore.getState().userDetails.id] : undefined,
              reaction: {
                type: reaction?.reaction?.split('_')[0],
                value: reaction?.reaction?.split('_')[1]
              },
              count: reaction?.count
            }))
          })
          .flat()
        // mog('Got reactions', { res, reactions })
        addReactions(reactions, nodeId)
      })
      .catch((err) => {
        mog('Error getting reactions', { err })
      })
  }

  const getReactionsOfBlock = (blockId: string) => {
    return reactions.filter((r) => r.blockId === blockId)
  }

  const getReactionDetails = async (blockId: string, nodeId: string) => {
    const reactionDetails = await reactionsAPI.getBlockReactionDetails(nodeId, blockId)
    const userReactions = (Array.isArray(reactionDetails) ? reactionDetails : [])
      .filter((r) => r?.reaction && Array.isArray(r?.reaction) && r?.reaction.length > 0)
      .map((r) => ({ userId: r.userId, reactions: r?.reaction?.map(StringToMIcon) }))
      .flat()
    // mog('reactionDetails', { reactionDetails, userReactions })
    // mog('reactionDetails', { reactionDetails })
    return userReactions as UserReaction[]
  }

  return {
    reactions,
    addReaction,
    deleteReaction,
    getAllReactionsOfNode,
    getReactionDetails,
    getReactionsOfBlock
  }
}
