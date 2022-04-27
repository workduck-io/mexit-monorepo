import { generateQuestionId } from '@mexit/core'

import { insertId } from '../../Utils/content'

export const ReleaseSnippet = insertId([
  {
    children: [
      {
        text: 'Release Checklist'
      }
    ],
    type: 'h1'
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
        text: 'Launch Checklist Owner: [['
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Launch Checklist Approver: [['
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Launch Checklist Contributors: [['
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Launch Checklist Informed: [['
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
        text: 'Launch Deadline: '
      },
      {
        text: 'Create a reminder from the toolbar.',
        italic: true
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
    type: 'h2',
    children: [
      {
        text: 'Pre-release checklist'
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
    type: 'h3',
    children: [
      {
        text: 'Engineering'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Work with QA by giving a demo and helping them update pages for the feature.'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Set the release type for relevant platforms.'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Database scheme'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Design'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Performance'
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
    type: 'h3',
    children: [
      {
        text: 'Community & marketing'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Demo of new feature'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Written help guides'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Update the What’s New page'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Are we updating socials?'
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
    type: 'h3',
    children: [
      {
        text: 'Growth & analytics'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'How do we track metrics?'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'What valuable questions can we ask about this feature?'
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
    type: 'h2',
    children: [
      {
        text: 'Project Summary'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Keep everyone on the same page by adding a quick summary about this launch here.',
        italic: true
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
    type: 'h2',
    children: [
      {
        text: 'Docs'
      }
    ]
  },
  {
    type: 'agent-based-question',
    question: 'Link Relevant Docs here',
    questionId: generateQuestionId(),
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
        text: ''
      }
    ]
  },
  {
    type: 'h2',
    children: [
      {
        text: 'Timeline'
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
    type: 'ul',
    children: [
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: '4 weeks before launch'
              }
            ]
          }
        ]
      },
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: '1 week before launch'
              }
            ]
          }
        ]
      },
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: '1 day before launch'
              }
            ]
          }
        ]
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
  }
])
