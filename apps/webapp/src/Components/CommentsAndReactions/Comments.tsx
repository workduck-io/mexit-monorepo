import React, { useCallback, useEffect, useMemo } from 'react'
import { Comment as CommentType, defaultContent, NodeEditorContent } from '@mexit/core'
import Plateless from '../Editor/Plateless'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import {
  CommentActions,
  CommentAuthor,
  CommentContentWrapper,
  CommentHeader,
  CommentsWrapper,
  CommentTime,
  CommentWrapper,
  NewCommentWrapper
} from './Comments.style'
import { Button, IconButton, Title } from '@workduck-io/mex-components'
import { CommentEditor } from '../CommentEditor'
import { PlateProvider } from '@udecode/plate'
import { CommentEditorWrapper } from '../CommentEditor/styled'
import { Icon } from '@iconify/react'
import { ProfileImage } from '../User/ProfileImage'
import { useAuthStore } from '../../Stores/useAuth'
import { useMentions } from '../../Hooks/useMentions'
import { tinykeys } from '@workduck-io/tinykeys'
import { useComments } from '../../Hooks/useComments'
import { RelativeTime } from '@mexit/shared'

type OnAddComment = (content: NodeEditorContent) => Promise<void>
type OnDeleteComment = (nodeid: string, commentId: string) => Promise<void>

interface CommentsProps {
  comments: CommentType[]
  onAddComment: OnAddComment
  onDeleteComment: OnDeleteComment
}

interface CommentProps {
  comment: CommentType
  onDeleteComment: OnDeleteComment
}

export const Comment = ({ comment, onDeleteComment }: CommentProps) => {
  const { getUserFromUserid } = useMentions()
  // const { deleteComment } = useComments()
  const currentUserDetails = useAuthStore((state) => state.userDetails)

  const user = useMemo(() => {
    const u = getUserFromUserid(comment.userId)
    if (u) return u
  }, [comment.userId])

  return (
    <CommentWrapper>
      <CommentHeader>
        <CommentAuthor>
          <ProfileImage size={20} email={user?.email} />@{user && user.alias}
        </CommentAuthor>
        <CommentActions>
          {comment.metadata?.createdAt && (
            <CommentTime>
              <RelativeTime dateNum={comment.metadata?.createdAt} />
            </CommentTime>
          )}
          {comment.userId === currentUserDetails?.userID && (
            /* Show delete button only when comment made by current user */
            <IconButton
              icon={deleteBin6Line}
              title="Delete Comment"
              onClick={() => onDeleteComment(comment.nodeId, comment.entityId)}
            />
          )}
        </CommentActions>
      </CommentHeader>
      <CommentContentWrapper>
        <Plateless multiline content={comment.content} />
      </CommentContentWrapper>
    </CommentWrapper>
  )
}

interface NewCommentProps {
  onAddComment: OnAddComment
  byUser: string
}

export const NewComment = ({ onAddComment, byUser }: NewCommentProps) => {
  const [content, setContent] = React.useState<NodeEditorContent>(defaultContent.content)
  const [commentEditorId = '', setCommentEditorId] = React.useState(() => Math.random().toString(36).substring(7))

  const onChange = (content: NodeEditorContent) => {
    setContent(content)
  }

  const onSubmit = useCallback(() => {
    onAddComment(content)
      .then(() => {
        setContent(defaultContent.content)
        setCommentEditorId(Math.random().toString(36).substring(7))
      })
      .catch((e) => {
        console.error(e)
      })
  }, [content])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+Enter': (ev) => {
        onSubmit()
      }
    })

    return () => unsubscribe()
  }, [onSubmit])

  return (
    <NewCommentWrapper>
      <CommentAuthor>
        <ProfileImage size={32} email={byUser} />
      </CommentAuthor>
      <CommentEditorWrapper>
        <PlateProvider id={commentEditorId}>
          <CommentEditor content={defaultContent.content} editorId={commentEditorId} onChange={onChange} />
        </PlateProvider>
      </CommentEditorWrapper>
      <IconButton size={16} icon="bi:reply" title="Add Comment" onClick={onSubmit} transparent={false} />
    </NewCommentWrapper>
  )
}

export const CommentsComponent = ({ comments, onAddComment, onDeleteComment }: CommentsProps) => {
  const currentUserDetails = useAuthStore((state) => state.userDetails)
  return (
    <CommentsWrapper>
      {comments
        .sort((a, b) => {
          if (a.metadata?.createdAt && b.metadata?.createdAt) {
            return a.metadata?.createdAt - b.metadata?.createdAt
          }
          return 0
        })
        .map((comment) => (
          <Comment key={comment.entityId} comment={comment} onDeleteComment={onDeleteComment} />
        ))}
      <NewComment onAddComment={onAddComment} byUser={currentUserDetails.email} />
    </CommentsWrapper>
  )
}
