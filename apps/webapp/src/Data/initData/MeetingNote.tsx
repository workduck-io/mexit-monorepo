import { insertId, toLocaleString } from '@mexit/core'

const meetingTemplate = (title: string, date: number, link: string) => [
  { type: 'h1', children: [{ text: title }] },
  {
    type: 'p',
    children: [
      { text: '' },
      { type: 'tag', children: [{ text: '' }], value: 'meeting' },
      { text: ` On ${toLocaleString(new Date(date))} - ` },
      { type: 'a', url: link, children: [{ text: 'Link' }] },
      { text: '' }
    ]
  },
  { type: 'p', children: [{ text: '' }] },
  { type: 'h2', children: [{ text: 'Updates' }] },
  {
    type: 'ul',
    children: [
      {
        type: 'li',
        children: [{ type: 'lic', children: [{ text: 'Updates of the team here' }] }]
      }
    ]
  },
  { type: 'p', children: [{ text: '' }] },
  { type: 'h2', children: [{ text: 'Agenda' }] },
  {
    type: 'ul',
    children: [
      {
        type: 'li',
        children: [{ type: 'lic', children: [{ text: 'List items for agenda here' }] }]
      }
    ]
  },
  { type: 'p', children: [{ text: '' }] },
  { type: 'h2', children: [{ text: 'Tasks' }] },
  { type: 'action_item', children: [{ text: 'Create tasks here' }] },
  { type: 'p', children: [{ text: '' }] },
  { type: 'h2', children: [{ text: 'Questions' }] },
  {
    type: 'ul',
    children: [
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [{ text: 'Any Questions asked?' }]
          }
        ]
      }
    ]
  },
  { type: 'p', children: [{ text: '' }] }
]

export const MeetingSnippetContent = (title: string, date: number, link: string) =>
  insertId(meetingTemplate(title, date, link))
