import React, { useMemo } from 'react'
import { Comment as CommentType, defaultContent, NodeEditorContent } from '@mexit/core'
import Plateless from '../Editor/Plateless'
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

export const Comment = ({ comment }: { comment: CommentType }) => {
  const { getUserFromUserid } = useMentions()
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
          <CommentTime></CommentTime>
          {comment.userId === currentUserDetails?.userID && (
            /* Show delete button only when comment made by current user */
            <IconButton icon="mdi:dots-vertical" title="Delete Comment" />
          )}
        </CommentActions>
      </CommentHeader>
      <CommentContentWrapper>
        <Plateless multiline content={comment.content} />
      </CommentContentWrapper>
    </CommentWrapper>
  )
}

interface CommentsProps {
  comments: CommentType[]
  onAddComment: (content: NodeEditorContent) => Promise<void>
}

export const NewComment = ({
  onAddComment,
  byUser
}: {
  onAddComment: (comment: NodeEditorContent) => Promise<void>
  byUser: string
}) => {
  const [content, setContent] = React.useState<NodeEditorContent>(defaultContent.content)
  const [commentEditorId = '', setCommentEditorId] = React.useState(() => Math.random().toString(36).substring(7))

  const onChange = (content: NodeEditorContent) => {
    setContent(content)
  }

  const onSubmit = () => {
    onAddComment(content)
      .then(() => {
        setContent(defaultContent.content)
        setCommentEditorId(Math.random().toString(36).substring(7))
      })
      .catch((e) => {
        console.error(e)
      })
  }

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

export const CommentsComponent = ({ comments, onAddComment }: CommentsProps) => {
  const currentUserDetails = useAuthStore((state) => state.userDetails)
  return (
    <CommentsWrapper>
      {comments.map((comment) => (
        <Comment comment={comment} />
      ))}
      <NewComment onAddComment={onAddComment} byUser={currentUserDetails.email} />
    </CommentsWrapper>
  )
}
