import { generateQuestionId } from '@mexit/core'

import { insertId } from '../../Utils/content'


export const PRDTemplate = insertId([
  {
    type: 'h1',
    children: [
      {
        text: 'Problem Alignment ',
        bold: true
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
    type: 'blockquote',
    children: [
      {
        text: 'Describe the problem we are trying to solve in 1-2 sentences. I should be able to read this alone and communicate the value/risks to someone else.'
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
    type: 'agent-based-question',
    question: 'Why does this matter to our customers and business?',
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
    type: 'agent-based-question',
    question: 'What evidence or insights do you have to support this?',
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
        text: 'High Level Approach'
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
    type: 'blockquote',
    children: [
      {
        text: 'Describe the rough shape of how we might tackle the problem. I should be able to squint my eyes and see the same shape. For example, if the problem was “discoverability of new features”, then this might be “a notification center for relevant features”. '
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
        text: 'Narrative'
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
    type: 'blockquote',
    children: [
      {
        text: 'Optional',
        bold: true
      },
      {
        text: ': Share (hypothetical) stories to paint a picture of what life looks like for customers today. Describe common and edgy use cases to consider when designing the solution. '
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
        text: 'Goals'
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
    type: 'ol',
    children: [
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: 'Describe high-level goals, ideally in priority order and not too many.',
                italic: true
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
                text: 'Include measurable (metrics) and immeasurable (feelings) goals',
                italic: true
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
                text: 'Keep it short and sweet',
                italic: true
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
        text: 'Non-goals'
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
    type: 'ol',
    children: [
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: 'List explicit areas we do not plan to address',
                italic: true
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
                text: 'Explain why they are not goals',
                italic: true
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
                text: 'These are as important and clarifying as the goals',
                italic: true
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
    type: 'table',
    children: [
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'REVIEWER',
                    bold: true
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'TEAM/ROLE',
                    bold: true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'action_item',
                children: [
                  {
                    text: 'As Tasks and set their priorities'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                text: '[['
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                text: ''
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                text: ''
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
    type: 'h1',
    children: [
      {
        text: 'Solution Alignment ',
        bold: true
      }
    ]
  },
  {
    type: 'table',
    children: [
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: '✅  '
                  },
                  {
                    text: 'Draw the perimeter',
                    italic: true
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                align: 'center',
                children: [
                  {
                    text: '🚫  '
                  },
                  {
                    text: 'Do not force others to identify scope',
                    italic: true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                align: 'center',
                children: [
                  {
                    text: ''
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                align: 'center',
                children: [
                  {
                    text: ''
                  }
                ]
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
        text: 'Key Features'
      }
    ]
  },
  {
    type: 'agent-based-question',
    question: 'Link Your feature documents here',
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
    type: 'h3',
    children: [
      {
        text: 'Plan of record'
      }
    ]
  },
  {
    type: 'ol',
    children: [
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: 'List the features that shape the solution',
                italic: true
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
                text: 'Ideally in priority order',
                italic: true
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
                text: 'Think of this like drawing the perimeter of the solution space',
                italic: true
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
                text: 'Draw the boundaries so the team can focus on how to fill it in',
                italic: true
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
                text: 'Link out to sub-docs for more detail for particularly large projects',
                italic: true
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
                text: 'Challenge the size to see if a smaller component can be shipped independently',
                italic: true
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
  },
  {
    type: 'h3',
    children: [
      {
        text: 'Future considerations'
      }
    ]
  },
  {
    type: 'ol',
    children: [
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: 'Optionally list features you are saving for later',
                italic: true
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
                text: 'These might inform how you build now',
                italic: true
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
        text: 'Key Flows'
      }
    ]
  },
  {
    type: 'blockquote',
    children: [
      {
        text: 'Show what the end-to-end experience will be for customers. This could be written prose, a flow diagram, screenshots, or design explorations. It will vary by project and team. '
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
    type: 'media_embed',
    children: [
      {
        text: ''
      }
    ],
    url: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FVMBUkuJovnRti9KyKet4lB%2FDemo---Onboarding-screens%3Fnode-id%3D0%253A1'
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
        text: ''
      }
    ]
  },
  {
    type: 'h2',
    children: [
      {
        text: 'Key Logic'
      }
    ]
  },
  {
    type: 'ol',
    children: [
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: 'List rules to guide design and development',
                italic: true
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
                text: 'Address common scenarios and edge cases',
                italic: true
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
                text: 'It is often easier to write these out than rely on design to show every permutation',
                italic: true
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
  },
  {
    type: 'table',
    children: [
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'REVIEWER',
                    bold: true
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'TEAM/ROLE',
                    bold: true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'action_item',
                children: [
                  {
                    text: 'As Tasks and set their priorities'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                text: '[['
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                text: ''
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                text: ''
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
    type: 'h1',
    children: [
      {
        text: 'Launch Plan',
        bold: true
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
    type: 'blockquote',
    children: [
      {
        text: 'Define the various phases that will get this product to market, the purpose of each phase, and the criteria you must meet to move on to the next one. Highlight risks and dependencies that can throw a wrench in timelines or progress (and ideally contingency plans). There is a table of example phases below. '
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
        text: 'Key Milestones'
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
    type: 'table',
    children: [
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'TARGET DATE',
                    bold: true
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'MILESTONE',
                    bold: true
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'DESCRIPTION',
                    bold: true
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'EXIT CRITERIA',
                    bold: true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'YYYY-MM-DD'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Pilot'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Internal testing with employees only'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'No P0 or P1 bugs on a rolling 7-day basis'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'YYYY-MM-DD'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Beta'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Early cohort of 20 customers'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'At least 10 customers would be disappointed if we took it away'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'YYYY-MM-DD'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Early Access'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Invite-only customers from sales'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'At least 1 win from every major competitor'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'YYYY-MM-DD'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Launch'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'All customers in current markets'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Measure and monitor'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    colSizes: [148, 129, 259, 0]
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
        text: 'Operational Checklist'
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
    type: 'table',
    children: [
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'TEAM',
                    bold: true
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'PROMPT',
                    bold: true
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Y/N',
                    bold: true
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'ACTION (if yes)',
                    bold: true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Analytics'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Do you need additional tracking?'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                text: ''
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Work with [person] on logging'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Sales'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Do you need sales enablement materials?'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                text: ''
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Work with [person]'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Marketing'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Does this impact shared KPI?'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                text: ''
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Work with [person] on goal adjustment'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Customer Success'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Do you need to update support content or training?'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                text: ''
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Work with [person] on updates'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Product Marketing'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Do you need a GTM plan? (e.g. pricing, packaging, positioning, '
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                text: ''
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Work with [person] with at least [x] weeks notice to kickoff workstreams'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Partners'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Will this impact any external partners?'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                text: ''
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Work with [person] on communication plan'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Globalization'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Are you launching in multiple countries?'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                text: ''
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Work with [person] '
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Risk'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Does this expose a risk vector?'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                text: ''
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Work with [person] '
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Legal'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Are there potential legal ramifications?'
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                text: ''
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Work with [person] '
                  }
                ]
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
    type: 'h1',
    children: [
      {
        text: 'Appendix',
        bold: true
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
        text: 'Changelog'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'List key decisions or updates you make for future reference. Include who was involved and link to notes doc, if relevant. Recommend moving this up top once approved so changes are more visible. ',
        italic: true
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
    type: 'table',
    children: [
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'DATE',
                    bold: true
                  }
                ]
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                type: 'p',
                children: [
                  {
                    text: 'DESCRIPTION',
                    bold: true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                text: ''
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                text: ''
              }
            ]
          }
        ]
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [
              {
                text: ''
              }
            ]
          },
          {
            type: 'td',
            children: [
              {
                text: ''
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
        text: 'Open Questions'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Track open questions and answers here. '
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
        text: 'FAQs'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Optional: Include an FAQ when helpful to answer high level questions so it is easier for people to grasp the point of the project without getting lost in the details of product definition. '
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
        text: 'Impact Checklist'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Permissions'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Reporting'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Pricing'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'API'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Global'
      }
    ]
  }
])
