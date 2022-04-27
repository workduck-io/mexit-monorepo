import { insertId } from '../../Utils/content'

export const BugReportTemplate = insertId([
  {
    type: 'p',
    children: [
      {
        text: 'Assigned to: [['
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Feature associated: [['
      },
      {
        text: ' '
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
        text: 'Describe the bug'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'A clear and concise description of what the bug is <add priority and track progress in tasks view> ',
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
    type: 'h3',
    children: [
      {
        text: 'Expected Behaviour'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Explain what was supposed to happen',
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
    type: 'h3',
    children: [
      {
        text: 'Screenshots'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'If applicable (simply drag and drop) ',
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
    type: 'h3',
    children: [
      {
        text: 'Additional Context'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Any additional things that might help gain context of the bug ',
        italic: true
      }
    ]
  }
])
