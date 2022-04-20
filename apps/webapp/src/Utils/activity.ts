import { Node } from '@mexit/core'

export const activityNode: Node = {
  id: '12345',
  content: [
    {
      type: 'p',
      id: 'TEMP_dYEwUeJ9EHgwMadfJ3diJ',
      nodeUID: '12345',
      children: [
        {
          type: 'p',
          id: 'TEMP_nmgjRAdzEyAErqbRLzykG',
          text: 'This is block 1, and here is some italics '
        },
        {
          type: 'p',
          id: 'TEMP_NJmxpLWRQJMFG3mmhz73q',
          italic: true,
          text: 'yo yo yo. '
        },
        {
          type: 'p',
          id: 'TEMP_gGGVNrGpbGLtfCHYQdewV',
          text: 'This is some non-italics again'
        }
      ]
    },
    {
      type: 'p',
      id: 'TEMP_yiEwBEVpJLw9D6KD6mzLW',
      nodeUID: '12345',
      children: [
        {
          type: 'p',
          id: 'TEMP_Qe7hFBgxrHbxpnj7HdNjJ',
          text: ''
        }
      ]
    },
    {
      type: 'p',
      id: 'TEMP_U7tQFwhEWK7P7FaC7WT9F',
      nodeUID: '12345',
      children: [
        {
          type: 'p',
          id: 'TEMP_yCcxDyYmfh9yhHcDWKEyj',
          text: 'This is another'
        }
      ]
    },
    {
      type: 'p',
      id: 'TEMP_4fLEyGKFjCBPt4ArVHqDR',
      nodeUID: '12345',
      children: [
        {
          type: 'p',
          id: 'TEMP_Y7nAdKB4FYFqziFYiRE8G',
          text: ''
        }
      ]
    },
    {
      type: 'h1',
      id: 'TEMP_feKePQYDViLhHq3DjtRqx',
      nodeUID: '12345',
      children: [
        {
          type: 'p',
          id: 'TEMP_TRfUdkPLGrkdcp9Xti6D7',
          text: 'This is yet another block'
        }
      ]
    }
  ]
}

export const exampleNode: Node = {
  id: '69420',
  content: [
    {
      type: 'p',
      id: 'CONTENT_QC_OaZGP3xBcuKLAOoh8pJ4O',
      nodeUID: '69420',
      children: [
        {
          type: 'p',
          text: 'Orwell depicted methods of a power hungry totalitarian regime and human conditions under such a regime. It is a dark book, compared to the rest. While Brave New World by Aldous Huxley felt more of a utopian world with the ideas like '
        },
        {
          type: 'p',
          text: 'everyone belongs to everyone else'
        },
        {
          type: 'p',
          text: ' and ',
          italics: true
        },
        {
          type: 'p',
          text: 'soma'
        },
        {
          type: 'p',
          text: '. The book conveys this very idea.'
        }
      ]
    }
  ]
}

export const nodes: Node[] = [activityNode, exampleNode]
