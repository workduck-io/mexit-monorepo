import { API, APIComment, APIReaction, GET_REQUEST_MINIMUM_GAP_IN_MS, MIcon, mog } from '@mexit/core'

interface ReactionRequests {
  nodeId: string
  blockId: string
  reaction: MIcon
  action: 'ADD' | 'DELETE'
}

export const useReactionAPI = () => {
  const addReaction = async (reaction: APIReaction) => {
    const reqData: ReactionRequests = {
      action: 'ADD',
      nodeId: reaction.nodeId,
      blockId: reaction.blockId,
      reaction: reaction.reaction
    }

    mog('Saving reaction', { reaction, reqData })

    const res = await API.reaction.react(reqData)
    return res
  }

  const deleteReaction = async (reaction: APIReaction) => {
    const reqData: ReactionRequests = {
      action: 'DELETE',
      nodeId: reaction.nodeId,
      blockId: reaction.blockId,
      reaction: reaction.reaction
    }
    mog('Deleting reaction', { reaction, reqData })

    const res = await API.reaction.react(reqData)
    return res
  }

  /**
   *
   * Response { [blockid]: reaction[] }
   * if user === true then reaction of current user
   * No user specific
   {
    "TEMP_W6nEW": [
        {
        // TF this can also be { type , val }
            "reaction": "EMOJI_👍",
            "count": 1,
            "user": true
              }
          ]
      }
      */
  const getReactionsOfNote = async (nodeId: string, force = false) => {
    const res = await API.reaction.getAllOfNode(nodeId, {
      cache: true,
      expiry: GET_REQUEST_MINIMUM_GAP_IN_MS
    })
    return res
  }

  const getReactionsOfBlock = async (nodeId: string, blockId: string) => {
    const res = await API.reaction.getAllOfBlock(nodeId, blockId)
    return res
  }

  const getBlockReactionDetails = async (nodeId: string, blockId: string) => {
    const res = await API.reaction.getDetailedOfBlock(nodeId, blockId)
    return res
  }

  return {
    addReaction,
    deleteReaction,
    getReactionsOfNote,
    getReactionsOfBlock,
    getBlockReactionDetails
  }
}

export const useCommentAPI = () => {
  const saveComment = async (comment: APIComment) => {
    const reqData = {
      nodeId: comment.nodeId,
      blockId: comment.blockId,
      threadId: comment.threadId,
      content: comment.content,
      entityId: comment.entityId
    }

    mog('Saving comment', { comment, reqData })

    const res = await API.comment.create(reqData)
    return res
  }

  const getComment = async (nodeid: string, id: string) => {
    const res = await API.comment.get(nodeid, id)
    return res
  }

  const deleteComment = async (nodeid: string, id: string) => {
    const res = await API.comment.delete(nodeid, id)
    return res
  }

  const getCommentsByNodeId = async (nodeId: string, force = false) => {
    const res = await API.comment.getAllOfNode(nodeId, {
      cache: true,
      expiry: GET_REQUEST_MINIMUM_GAP_IN_MS
    })
    return res
  }

  const deleteCommentsByNodeId = async (nodeId: string) => {
    const res = await API.comment.deleteAllOfNode(nodeId)
    return res
  }

  const getCommentsByBlockId = async (nodeId: string, blockId: string) => {
    const res = await API.comment.getAllOfBlock(nodeId, blockId)
    return res
  }

  const deleteCommentsByBlockId = async (nodeId: string, blockId: string) => {
    const res = await API.comment.deleteAllOfBlock(nodeId, blockId)
    return res
  }

  const getCommentsByThreadId = async (nodeId: string, blockId: string, threadId: string) => {
    const res = await API.comment.getAllOfThread(nodeId, blockId, threadId)
    return res
  }

  const deleteCommentsByThreadId = async (nodeId: string, blockId: string, threadId: string) => {
    const res = await API.comment.deleteAllOfThread(nodeId, blockId, threadId)
    return res
  }

  return {
    saveComment,
    getComment,
    deleteComment,
    getCommentsByNodeId,
    deleteCommentsByNodeId,
    getCommentsByBlockId,
    deleteCommentsByBlockId,
    getCommentsByThreadId,
    deleteCommentsByThreadId
  }
}
