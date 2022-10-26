import { client } from '@workduck-io/dwindle'

import { apiURLs, mog, Comment, MIcon, Reaction } from '@mexit/core'

import { useAPIHeaders } from './useAPIHeaders'

interface ReactionRequests {
  nodeId: string
  blockId: string
  reaction: MIcon
  action: 'ADD' | 'DELETE'
}

export const useReactionAPI = () => {
  const { workspaceHeaders, workspaceId } = useAPIHeaders()
  // NOt empty
  const addReaction = async (reaction: Omit<Reaction, 'userId'>) => {
    const workspaceIdStr = workspaceId()
    const reqData: ReactionRequests = {
      // Check this is necessary or not
      // workspaceId: workspaceIdStr,
      action: 'ADD',
      nodeId: reaction.nodeId,
      blockId: reaction.blockId,
      reaction: reaction.reaction
      // properties: comment.properties
    }

    mog('Saving reaction', { reaction, reqData })

    const res = await client.post(apiURLs.reactions.react, reqData, {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const deleteReaction = async (reaction: Omit<Reaction, 'userId'>) => {
    const workspaceIdStr = workspaceId()
    const reqData: ReactionRequests = {
      // Check this is necessary or not
      // workspaceId: workspaceIdStr,
      action: 'DELETE',
      nodeId: reaction.nodeId,
      blockId: reaction.blockId,
      reaction: reaction.reaction
      // properties: comment.properties
    }
    mog('Deleting reaction', { reaction, reqData })

    const res = await client.post(apiURLs.reactions.react, reqData, {
      headers: workspaceHeaders()
    })
    return res.data
  }

  /**
   *
   * Response { [blockid]: reaction[] }
   * if user === true then reaction of current user
   * No user specific
   {
    "TEMP_W6nEW": [
        {
            "reaction": "EMOJI_👍",
            "count": 1,
            "user": true
              }
          ]
      }
      */
  const getReactionsOfNote = async (nodeId: string) => {
    const res = await client.get(apiURLs.reactions.allNote(nodeId), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const getReactionsOfBlock = async (nodeId: string, blockId: string) => {
    const res = await client.get(apiURLs.reactions.allBlock(nodeId, blockId), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const getBlockReactionDetails = async (nodeId: string, blockId: string) => {
    const res = await client.get(apiURLs.reactions.blockReactionDetails(nodeId, blockId), {
      headers: workspaceHeaders()
    })
    return res.data
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
  const { workspaceHeaders, workspaceId } = useAPIHeaders()

  const saveComment = async (comment: Omit<Comment, 'userId'>) => {
    const workspaceIdStr = workspaceId()
    const reqData = {
      // Check this is necessary or not
      // workspaceId: workspaceIdStr,
      nodeId: comment.nodeId,
      blockId: comment.blockId,
      threadId: comment.threadId,
      content: comment.content,
      entityId: comment.entityId
      // properties: comment.properties
    }

    mog('Saving comment', { comment, reqData })

    const res = await client.post(apiURLs.comments.saveComment, reqData, {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const getComment = async (id: string) => {
    const res = await client.get(apiURLs.comments.comment(id), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const deleteComment = async (id: string) => {
    const res = await client.delete(apiURLs.comments.comment(id), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const getCommentsByNodeId = async (nodeId: string) => {
    const res = await client.get(apiURLs.comments.allNote(nodeId), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const deleteCommentsByNodeId = async (nodeId: string) => {
    const res = await client.delete(apiURLs.comments.allNote(nodeId), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const getCommentsByBlockId = async (nodeId: string, blockId: string) => {
    const res = await client.get(apiURLs.comments.allBlock(nodeId, blockId), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const deleteCommentsByBlockId = async (nodeId: string, blockId: string) => {
    const res = await client.delete(apiURLs.comments.allBlock(nodeId, blockId), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const getCommentsByThreadId = async (nodeId: string, blockId: string, threadId: string) => {
    const res = await client.get(apiURLs.comments.allThread(nodeId, blockId, threadId), {
      headers: workspaceHeaders()
    })
    return res.data
  }

  const deleteCommentsByThreadId = async (nodeId: string, blockId: string, threadId: string) => {
    const res = await client.delete(apiURLs.comments.allThread(nodeId, blockId, threadId), {
      headers: workspaceHeaders()
    })
    return res.data
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
