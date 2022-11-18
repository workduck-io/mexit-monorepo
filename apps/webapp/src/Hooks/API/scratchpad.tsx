import { defaultContent, generateCommentId, generateHighlightId, mog } from '@mexit/core'
import { Button } from '@workduck-io/mex-components'
import { useEffect } from 'react'
import { useCommentAPI, useReactionAPI } from './useCommentAndReactionAPI'
import { useHighlightAPI } from './useHighlightAPI'

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
  const highlightAPI = useHighlightAPI()

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
      .deleteComment('NODE_xJQt6DWHwqXgVxAJUR3gx', 'COMMENT_faAE7')
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

  const testAddHighlight = () => {
    highlightAPI
      .saveHighlight({
        entityId: generateHighlightId(),
        properties: {
          sourceUrl: 'https://www.wired.com/story/elon-musk-tesla-elon-musk-tesla/',
          saveableRange: {
            startMeta: {
              parentTagName: 'A',
              parentIndex: 128,
              textOffset: 0
            },
            endMeta: {
              parentTagName: 'LI',
              parentIndex: 56,
              textOffset: 60
            },
            text: 'Elon Musk’s Tesla Is a Car That Can Drive Itself. But Is It Safe?',
            id: '63023772-32e9-4d85-b0e8-933cd429eab3'
          }
        }
      })
      .then((res) => {
        mog('Added highlight', { res })
      })
      .catch((err) => {
        mog('Error adding highlight', { err })
      })
  }

  const testDeleteHighlight = () => {
    highlightAPI
      .deleteHighlight('HIGHLIGHT_h7kcGPpGcAiCg663AcKGw')
      .then((res) => {
        mog('Deleted highlight', { res })
      })
      .catch((err) => {
        mog('Error deleting highlight', { err })
      })
  }

  const testFetchAllHighlights = () => {
    highlightAPI
      .getAllHighlights()
      .then((res) => {
        mog('Fetched highlights', { res })
      })
      .catch((err) => {
        mog('Error fetching highlights', { err })
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
    },
    highlights: {
      testAddHighlight,
      testDeleteHighlight,
      testFetchAllHighlights
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
