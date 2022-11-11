import { defaultContent, generateCommentId, mog } from '@mexit/core'
import { Button } from '@workduck-io/mex-components'
import { useEffect } from 'react'
import { useCommentAPI, useReactionAPI } from './useCommentAndReactionAPI'

const sampleContent = [
  {
    type: 'p',
    children: [
      {
        text: 'Hello this is a comment text',
        id: 'TEMP_fkFk'
      }
    ],
    id: 'TEMP_Qaksajdjha'
  }
]

export const useAPIScratchpad = () => {
  const commentAPI = useCommentAPI()
  const reactionAPI = useReactionAPI()

  useEffect(() => {
    mog('useAPIScratchpad')
    //
  }, [])

  const testCommentSave = () => {
    commentAPI
      .saveComment({
        blockId: 'TEMP_W6nEW',
        content: sampleContent,
        entityId: generateCommentId(),
        nodeId: 'NODE_xJQt6DWHwqXgVxAJUR3gx'
      })
      .then((res) => {
        mog('Saved comment', { res })
      })
      .catch((err) => {
        mog('Error saving comment', { err })
      })
  }

  const testCommentThreadSave = () => {
    commentAPI
      .saveComment({
        blockId: 'TEMP_W6nEW',
        content: sampleContent,
        threadId: 'COMMENT_faAE7',
        entityId: generateCommentId(),
        nodeId: 'NODE_xJQt6DWHwqXgVxAJUR3gx'
      })
      .then((res) => {
        mog('Saved comment', { res })
      })
      .catch((err) => {
        mog('Error saving comment', { err })
      })
  }

  const testDeleteComment = () => {
    commentAPI
      .deleteComment('COMMENT_gphad')
      .then((res) => {
        mog('Deleted comment', { res })
      })
      .catch((err) => {
        mog('Error deleting comment', { err })
      })
  }

  const testCommentFetch = () => {
    commentAPI
      .getCommentsByNodeId('NODE_xJQt6DWHwqXgVxAJUR3gx')
      .then((res) => {
        mog('Fetched comment', { res })
      })
      .catch((err) => {
        mog('Error fetching comment', { err })
      })
  }

  const testCommentFetchByBlock = () => {
    commentAPI
      .getCommentsByBlockId('NODE_xJQt6DWHwqXgVxAJUR3gx', 'TEMP_W6nEW')
      .then((res) => {
        mog('Fetched comment', { res })
      })
      .catch((err) => {
        mog('Error fetching comment', { err })
      })
  }

  const testCommentFetchByThread = () => {
    commentAPI
      .getCommentsByThreadId('NODE_xJQt6DWHwqXgVxAJUR3gx', 'TEMP_W6nEW', 'COMMENT_faAE7')
      .then((res) => {
        mog('Fetched comment', { res })
      })
      .catch((err) => {
        mog('Error fetching comment', { err })
      })
  }

  const testDeleteCommentByBlock = () => {
    commentAPI
      .deleteCommentsByBlockId('NODE_xJQt6DWHwqXgVxAJUR3gx', 'TEMP_W6nEW')
      .then((res) => {
        mog('Deleted comment', { res })
      })
      .catch((err) => {
        mog('Error deleting comment', { err })
      })
  }

  const testDeleteThreadByThreadId = () => {
    commentAPI
      .deleteCommentsByThreadId('NODE_xJQt6DWHwqXgVxAJUR3gx', 'TEMP_W6nEW', 'COMMENT_faAE7')
      .then((res) => {
        mog('Deleted comment', { res })
      })
      .catch((err) => {
        mog('Error deleting comment', { err })
      })
  }

  const testDeleteCommentByNodeId = () => {
    commentAPI
      .deleteCommentsByNodeId('NODE_xJQt6DWHwqXgVxAJUR3gx')
      .then((res) => {
        mog('Deleted comment', { res })
      })
      .catch((err) => {
        mog('Error deleting comment', { err })
      })
  }

  // REACTIONS
  //
  const testAddReaction = () => {
    reactionAPI
      .addReaction({
        nodeId: 'NODE_xJQt6DWHwqXgVxAJUR3gx',
        blockId: 'TEMP_W6nEW',
        reaction: {
          type: 'EMOJI',
          value: '👍'
        }
      })
      .then((res) => {
        mog('Added reaction', { res })
      })
      .catch((err) => {
        mog('Error adding reaction', { err })
      })
  }

  const testDeleteReaction = () => {
    reactionAPI
      .deleteReaction({
        nodeId: 'NODE_xJQt6DWHwqXgVxAJUR3gx',
        blockId: 'TEMP_W6nEW',
        reaction: {
          type: 'EMOJI',
          value: '👍'
        }
      })
      .then((res) => {
        mog('Deleted reaction', { res })
      })
      .catch((err) => {
        mog('Error deleting reaction', { err })
      })
  }

  const testGetReactionsOfNote = () => {
    reactionAPI
      .getReactionsOfNote('NODE_xJQt6DWHwqXgVxAJUR3gx')
      .then((res) => {
        mog('Fetched reactions', { res })
      })
      .catch((err) => {
        mog('Error fetching reactions', { err })
      })
  }

  const testGetReactionsOfBlock = () => {
    reactionAPI
      .getReactionsOfBlock('NODE_xJQt6DWHwqXgVxAJUR3gx', 'TEMP_W6nEW')
      .then((res) => {
        mog('Fetched reactions', { res })
      })
      .catch((err) => {
        mog('Error fetching reactions', { err })
      })
  }

  const testBlockReactionDetails = () => {
    reactionAPI
      .getBlockReactionDetails('NODE_xJQt6DWHwqXgVxAJUR3gx', 'TEMP_W6nEW')
      .then((res) => {
        mog('Fetched reactions', { res })
      })
      .catch((err) => {
        mog('Error fetching reactions', { err })
      })
  }

  return {
    comments: {
      testCommentSave,
      testCommentFetch,
      testCommentThreadSave,
      testCommentFetchByBlock,
      testCommentFetchByThread,
      testDeleteComment,
      testDeleteCommentByBlock,
      testDeleteThreadByThreadId,
      testDeleteCommentByNodeId
    },
    reactions: {
      testAddReaction,
      testDeleteReaction,
      testGetReactionsOfNote,
      testGetReactionsOfBlock,
      testBlockReactionDetails
    }
  }
}

export const APIScratchpad = () => {
  const apis = useAPIScratchpad()

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
      {Object.keys(apis).map((group) => (
        <div key={group}>
          <h3>{group}</h3>
          {Object.keys(apis[group]).map((action) => (
            <Button onClick={apis[group][action]}>{action}</Button>
          ))}
        </div>
      ))}
    </div>
  )
}
