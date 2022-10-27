import React from 'react'
import { Comment as CommentType } from '@mexit/core'
import Plateless from '../Editor/Plateless'

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
}

export const CommentsComponent = ({ comments }: CommentsProps) => {
  return (
    <div>
      <p>Comments</p>
      {comments.map((comment) => (
        <Comment comment={comment} />
      ))}
      <div>
        <textarea placeholder="Add a comment" />
      </div>
    </div>
  )
}
