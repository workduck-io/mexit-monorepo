import React, { useMemo } from 'react'
import { APIComment, Comment as CommentType, defaultContent, NodeEditorContent } from '@mexit/core'
import Plateless from '../Editor/Plateless'
import { CommentsWrapper } from './Comments.style'
import { Title } from '@workduck-io/mex-components'
import TaskEditor from '../CreateTodoModal/TaskEditor'
import { CommentEditor } from '../CommentEditor'
import { PlateProvider } from '@udecode/plate'
import { CommentEditorWrapper } from '../CommentEditor/styled'

export const Comment = ({ comment }: { comment: CommentType }) => {
  return (
    <div>
      <b>{comment.userId}</b>
      <Plateless content={comment.content} />
    </div>
  )
}

interface CommentsProps {
  comments: CommentType[]
  onAddComment: (content: NodeEditorContent) => void
}

export const NewComment = ({ onAddComment }: { onAddComment: (comment: NodeEditorContent) => void }) => {
  const commentEditorId = useMemo(() => `CommentEditor-new`, [])
  const onSubmit = () => {
    // if (textAreaRef.current) {
    // const content = textAreaRef.current.value
    onAddComment([{ children: [{ text: 'content' }] }])
    // }
  }
  return (
    <div>
      <CommentEditorWrapper>
        <PlateProvider id={commentEditorId}>
          <CommentEditor
            content={defaultContent.content}
            editorId={commentEditorId}
            onChange={(con) => console.log(con)}
          />
        </PlateProvider>
      </CommentEditorWrapper>
      <button onClick={() => onSubmit()}>Submit</button>
    </div>
  )
}

export const CommentsComponent = ({ comments, onAddComment }: CommentsProps) => {
  return (
    <CommentsWrapper>
      <Title>Comments</Title>
      {comments.map((comment) => (
        <Comment comment={comment} />
      ))}
      <NewComment onAddComment={onAddComment} />
    </CommentsWrapper>
  )
}
