import React, { useCallback, useEffect, useMemo } from 'react'

import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import { PlateProvider } from '@udecode/plate'

import { IconButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { Comment as CommentType, defaultContent, NodeEditorContent } from '@mexit/core'
import { RelativeTime } from '@mexit/shared'

import { useMentions } from '../../Hooks/useMentions'
import { useAuthStore } from '../../Stores/useAuth'
import { areEqual } from '../../Utils/hash'
import { CommentEditor } from '../CommentEditor'
import { CommentEditorWrapper } from '../CommentEditor/styled'
import Plateless from '../Editor/Plateless'
import { ProfileImage } from '../User/ProfileImage'

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
  const currentUserComment = comment.userId === currentUserDetails?.userID

  return (
    <CommentWrapper userCommented={currentUserComment}>
      <CommentHeader>
        <CommentAuthor userCommented={currentUserComment}>
          <ProfileImage size={20} email={user?.email} />@{user && user.alias}
        </CommentAuthor>
        <CommentActions>
          {comment.metadata?.createdAt && (
            <CommentTime>
              <RelativeTime dateNum={comment.metadata?.createdAt} />
            </CommentTime>
          )}
          {currentUserComment && (
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
    if (areEqual(content, defaultContent.content)) return
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
