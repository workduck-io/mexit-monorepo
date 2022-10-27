import React from 'react'
import { APIComment, Comment as CommentType, defaultContent, NodeEditorContent } from '@mexit/core'
import Plateless from '../Editor/Plateless'
import { CommentsWrapper } from './Comments.style'
import { Title } from '@workduck-io/mex-components'
import TaskEditor from '../CreateTodoModal/TaskEditor'

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
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null)
  const onSubmit = () => {
    // if (textAreaRef.current) {
    // const content = textAreaRef.current.value
    onAddComment([{ children: [{ text: 'content' }] }])
    // }
  }
  return (
    <div>
      <TaskEditor content={defaultContent.content} editorId="comment-editor-max" onChange={(con) => console.log(con)} />
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
