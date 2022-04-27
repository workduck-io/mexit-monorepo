import { insertId } from '../../Utils/content'
import { generateQuestionId } from '@mexit/core'

export const GTMPlanSnippet = insertId([
  {
    type: 'h1',
    children: [
      {
        text: 'GTM Plan '
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
        text: 'Positioning Statement'
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
                text: 'Use the 1-2 sentence description of target customers, their unmet needs, and your proposed solution from your [['
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
                text: 'We suggest you use the positioning statement from '
              },
              {
                type: 'a',
                url: 'https://youexec.com/book-summaries/marketing-selling-high-tech-products',
                children: [
                  {
                    text: 'Crossing the Chasm',
                    underline: true
                  }
                ]
              },
              {
                text: '\n\n'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    type: 'h2',
    children: [
      {
        text: 'Early Adopter Segments'
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
        text: 'Describe your early adopter segment(s) in whatever terms are relevant: demographics, distinctive unmet needs, behaviors (e.g., usage of existing solutions), psychographics, etc.'
      }
    ]
  },
  {
    type: 'agent-based-question',
    question: 'Add your user persona docs here  ',
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
        text: '\n'
      }
    ]
  },
  {
    type: 'h2',
    children: [
      {
        text: 'Channel Strategy'
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
        text: 'What channels will you use to sell to end customers? If you plan to use a hybrid approach, what mix do you anticipate between:'
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
                text: 'Your own website/app'
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
                text: 'Your own sales force (if you employ one, what will be the mix between inside sales and field sales?)'
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
                text: 'Channel partners (e.g., retailers, value added resellers)'
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
        text: '\n'
      }
    ]
  },
  {
    type: 'h2',
    children: [
      {
        text: 'Initial Marketing Methods'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: '\nWhat are the strengths and potential weaknesses of these marketing methods, given your early adopter segments, your value proposition, and your likely competition?'
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
                text: 'For each method, what metrics will you use to track performance?'
              },
              {
                text: ' '
              }
            ]
          }
        ]
      }
    ]
  },
  {
    type: 'agent-based-question',
    question: 'Add your marketing channel docs here',
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
        text: '\n'
      }
    ]
  },
  {
    type: 'h2',
    children: [
      {
        text: 'Testing Plan'
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
                text: 'Describe the results of any tests of marketing methods that you have completed to date. '
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
                text: 'What hypotheses, metrics, and sampling approach will you use? How much will you spend on these tests? - this will help you track the efficiency of your marketing methods'
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
        text: '\n'
      }
    ]
  },
  {
    type: 'h2',
    children: [
      {
        text: 'LTV/CAC'
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
        text: 'After you achieve product-market fit, what are your targets for customer lifetime value and customer acquisition cost for customers acquired via paid marketing methods?'
      },
      {
        text: '\n'
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
                text: 'LTV\n'
              },
              {
                text: 'What average annual revenue do you expect, per customer? What variable contribution margin? What annual retention rate/average customer life?'
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
                text: 'CAC for paid marketing methods '
              }
            ]
          }
        ]
      }
    ]
  },
  {
    type: 'agent-based-question',
    question: 'Add your docs on paid marketing experiments you ran',
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
  }
])
