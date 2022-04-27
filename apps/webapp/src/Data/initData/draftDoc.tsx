import { NodeContent } from '@mexit/core'

import { insertId } from '../../Utils/content'

export const draftDoc = insertId([
  {
    type: 'h1',
    children: [
      {
        text: 'Draft'
      }
    ]
  },
  {
    children: [
      {
        text: 'All your captures go here!'
      }
    ],
    type: 'blockquote'
  }
])

export const draftContent: NodeContent = {
  type: 'init',
  content: draftDoc,
  version: -1
}
