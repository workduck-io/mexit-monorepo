import { NodeContent } from '@mexit/core'
import { insertId } from '../../Utils/content'

export const OnboardingDoc = insertId([
  {
    children: [
      {
        text: 'What is Mex?',
        bold: true
      }
    ],
    type: 'p'
  },
  {
    type: 'p',
    children: [
      {
        text: 'Mex is your Product team’s self-organising workspace, designed as simple as your notes-app!'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: ' '
      }
    ]
  },
  {
    type: 'blockquote',
    children: [
      {
        text: 'Brining no-code/low-code Product Operations to life :)'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: ''
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Onboarding Checklist',
        bold: true
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        bold: true,
        text: ''
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Here are few quick things we would be focussing on:'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: ''
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Quick Capture'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: ''
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Backlinks'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: ''
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Snippets'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: ''
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Tasks'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: ''
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Suggestions'
      }
    ]
  }
])
export const onboardingContent: NodeContent = {
  type: 'init',
  content: OnboardingDoc,
  version: -1
}
