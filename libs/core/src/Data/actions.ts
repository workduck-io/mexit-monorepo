import { MEXIT_ACTIONS_URL_BASE } from '../Utils/routes'
import { ActionType, MexitAction } from '../Types/Actions'
import { CategoryType, QuickLinkType } from '../Types/Editor'

export const CREATE_NEW_ITEM = {
  title: 'Create new ',
  id: 'create-new-node',
  icon: 'bi:plus-circle',
  category: QuickLinkType.backlink,
  description: 'Quick note',
  shortcut: {
    edit: {
      category: 'action',
      keystrokes: 'Enter',
      title: 'to create'
    }
  },
  extras: {
    new: true
  }
}

// TODO: change shortcut keys based on user's OS
export const initActions: Array<MexitAction> = [
  {
    id: 'ACTION_1',
    title: 'Capture Screenshot',
    category: QuickLinkType.action,
    description: 'Capture visible window and send to Mexit',
    type: ActionType.SCREENSHOT,
    icon: 'bx:screenshot',
    shortcut: {
      capture: {
        category: 'action',
        title: 'to capture',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_LHQhtM9eA3avcNvy8RYgS',
    title: 'Shorten URL',
    category: QuickLinkType.action,
    description: 'Share this URL as an alias',
    type: ActionType.RENDER,
    icon: 'ri:link',
    shortcut: {
      shorten: {
        title: 'to shorten',
        category: 'action',
        keystrokes: 'Enter'
      }
    },
    data: { src: `${MEXIT_ACTIONS_URL_BASE}/shortener` }
  },
  {
    id: 'ACTION_zQZg48LsKubhbZzVvNyZX',
    type: ActionType.SEARCH,
    category: QuickLinkType.action,
    title: 'Search Twitter',
    description: 'Search on Twitter',
    icon: 'bi:twitter',
    shortcut: {
      search: {
        category: 'action',
        title: 'to search',
        keystrokes: 'Enter'
      }
    },
    data: { base_url: 'https://twitter.com/search?q=' }
  },
  {
    id: 'ACTION__JZ7DbTRtgVyUWIZ6Rvjs',
    type: ActionType.OPEN,
    title: 'Open Gmail',
    category: QuickLinkType.action,
    description: 'Open your default Gmail Account',
    icon: 'simple-icons:gmail',
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    },
    data: { base_url: 'https://gmail.com' }
  },
  {
    id: 'ACTION_G7vQElzF0MXhcRVCJsoIP',
    title: 'Reload',
    category: QuickLinkType.action,
    description: 'Reload current tab',
    type: ActionType.BROWSER_EVENT,
    icon: 'eva:refresh-outline',
    data: { event_name: 'reload' },
    shortcut: {
      reload: {
        title: 'to reload',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_nlTaC5-ZcMXgaJrNg_NfL',
    title: 'New Google Doc',
    category: QuickLinkType.action,
    description: 'Create new empty Google Doc with default Google Account',
    type: ActionType.OPEN,
    icon: 'material-symbols:docs',
    data: { base_url: 'https://docs.new' },
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_H77GDKfBFVriXpplM-b1x',
    title: 'New Google Sheet',
    category: QuickLinkType.action,
    description: 'Create new empty Google Sheet with default Google Account',
    type: ActionType.OPEN,
    icon: 'simple-icons:googlesheets',
    data: { base_url: 'https://sheets.new' },
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_gpymSN3oEOd4gfCdfwK4E',
    title: 'New Google Slides',
    category: QuickLinkType.action,
    description: 'Create new empty Google Slides with default Google Account',
    type: ActionType.OPEN,
    icon: 'material-symbols:slides',
    data: { base_url: 'https://slides.new' },
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_XGHlAYLbMrcROQbgIJMBl',
    title: 'New GitHub Gist',
    category: QuickLinkType.action,
    description: 'Create new GitHub Gist',
    type: ActionType.OPEN,
    icon: 'bi:github',
    data: { base_url: 'https://gist.new' },
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_WMORyqSCI5gdYq-0ZEXTx',
    title: 'New GitHub Repo',
    category: QuickLinkType.action,
    description: 'Create new GitHub Repository',
    type: ActionType.OPEN,
    icon: 'bi:github',
    data: { base_url: 'https://repo.new' },
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_30FPylVvxZDAfeoyTdxOY',
    title: 'New Figma File',
    category: QuickLinkType.action,
    description: 'Create new empty Figma File',
    type: ActionType.OPEN,
    icon: 'ph:figma-logo-fill',
    data: { base_url: 'https://figma.new' },
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_w5lK-B2y5p8-vxuq-254_',
    title: 'New Linear issue',
    category: QuickLinkType.action,
    description: 'Create a new Linear issue',
    type: ActionType.OPEN,
    icon: 'gg:linear',
    data: { base_url: 'https://linear.new' },
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_dh7Hq50UFvK3LQP5_E-70',
    title: 'New Notion page',
    category: QuickLinkType.action,
    description: 'Create a new Notion page',
    type: ActionType.OPEN,
    icon: 'simple-icons:notion',
    data: { base_url: 'https://notion.new' },
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_2vWe76dH6sXpxOH081X7J',
    title: 'New Google form',
    category: QuickLinkType.action,
    description: 'Create a new Google form',
    type: ActionType.OPEN,
    icon: 'ri:drive-fill',
    data: { base_url: 'https://forms.new' },
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_o1LA-TFz5-szRUaMPSsqh',
    title: 'New Tweet',
    category: QuickLinkType.action,
    description: 'Make a new Tweet',
    type: ActionType.OPEN,
    icon: 'bi:twitter',
    data: {
      base_url: 'https://twitter.com/intent/tweet'
    },
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_RIVhQLkDOJiApxuM6l7gE',
    title: 'Downloads',
    category: QuickLinkType.action,
    description: 'Browse through your downloads',
    type: ActionType.BROWSER_EVENT,
    icon: 'bx:download',
    data: {
      event_name: 'chrome-url',
      base_url: 'chrome://downloads'
    },
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_u1Fc119Vi69v1Ag-HKU0Y',
    title: 'Extensions',
    category: QuickLinkType.action,
    description: 'Manage your chrome extensions',
    type: ActionType.BROWSER_EVENT,
    icon: 'bx:extension',
    data: {
      event_name: 'chrome-url',
      base_url: 'chrome://extensions'
    },
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_vUiFbCMGsoJxOHhh6m3IT',
    title: 'Search Gmail',
    category: QuickLinkType.action,
    description: 'Search within your default Gmail Account',
    type: ActionType.SEARCH,
    icon: 'simple-icons:gmail',
    shortcut: {
      search: {
        category: 'action',
        title: 'to search',
        keystrokes: 'Enter'
      }
    },
    data: {
      base_url: 'https://mail.google.com/mail/#search/'
    }
  },
  {
    id: 'ACTION_DhQ9ozhUTXPTmfkHncMiH',
    title: 'Search Wikipedia',
    category: QuickLinkType.action,
    description: 'Search on Wikipedia',
    type: ActionType.SEARCH,
    icon: 'simple-icons:wikipedia',
    shortcut: {
      search: {
        category: 'action',
        title: 'to search',
        keystrokes: 'Enter'
      }
    },
    data: {
      base_url: 'http://en.wikipedia.org/?search='
    }
  },
  {
    id: 'ACTION_QKur_eR3JVLNCX-gwkeGW',
    title: 'Search YouTube',
    category: QuickLinkType.action,
    description: 'Search on YouTube',
    type: ActionType.SEARCH,
    icon: 'bi:youtube',
    shortcut: {
      search: {
        category: 'action',
        title: 'to search',
        keystrokes: 'Enter'
      }
    },
    data: {
      base_url:
        'http://www.youtube.com/results?search_type=search_videos&search_sort=relevance&search=Search&search_query='
    }
  },
  {
    id: 'ACTION_JWOtwPiaMnyL_RVgT3Jn7',
    title: 'Search Google Drive',
    category: QuickLinkType.action,
    description: 'Search Google Drive on default Google Account',
    type: ActionType.SEARCH,
    icon: 'ri:drive-fill',
    shortcut: {
      search: {
        category: 'action',
        title: 'to search',
        keystrokes: 'Enter'
      }
    },
    data: {
      base_url: 'https://drive.google.com/drive/search?q='
    }
  },
  {
    id: 'ACTION_A6VLKiPZeHGw0EFq-dtV7',
    title: 'Search GitHub',
    category: QuickLinkType.action,
    description: 'Search on GitHub',
    type: ActionType.SEARCH,
    icon: 'bi:github',
    shortcut: {
      search: {
        category: 'action',
        title: 'to search',
        keystrokes: 'Enter'
      }
    },
    data: {
      base_url: 'https://github.com/search?ref=opensearch&q='
    }
  },
  {
    id: 'ACTION_t4Gbp9x7f6jmkKBALbYQ4',
    title: 'Capture Multiple Tabs',
    icon: 'bi:collection-fill',
    category: QuickLinkType.action,
    description: 'Save a group of tabs to retrieve later',
    type: ActionType.RENDER,
    shortcut: {
      capture: {
        category: 'action',
        title: 'to capture',
        keystrokes: 'Enter'
      }
    },
    data: {
      componentName: 'CreateTabCapture'
    }
  },
  // {
  //   id: 'ACTION_t4Gbp9x7f6jmkKB3LbYQ5',
  //   title: 'Show Captured Tab Groups',
  //   description: 'List and Open Tab Saved Tab Groups',
  //   type: ActionType.RENDER,
  //   data: {
  //     componentName: 'ShowTabCaptures'
  //   }
  // },
  {
    id: 'ACTION_9x7f6jmkKB3LbYQ5t4Gbp',
    title: 'Colour Picker',
    category: QuickLinkType.action,
    icon: 'eva:color-picker-fill',
    description: "Pretend you're a designer and steal some colours",
    type: ActionType.RENDER,
    data: {
      src: `${MEXIT_ACTIONS_URL_BASE}/color-picker`
    },
    shortcut: {
      pick: {
        title: 'to pick',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_9x7LbYQ5t4Gbpf6jmkKB3',
    title: 'Unix Epoch Converter',
    category: QuickLinkType.action,
    description: 'Convert Epoch Timestamp to Datetime and vice versa',
    icon: 'material-symbols:date-range',
    type: ActionType.RENDER,
    data: {
      src: `${MEXIT_ACTIONS_URL_BASE}/epoch`
    },
    shortcut: {
      convert: {
        title: 'to convert',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: '007',
    title: 'Corporate Buzzwords',
    category: QuickLinkType.action,
    description: 'Gimme some Corporate BS Buzzwords',
    icon: 'material-symbols:corporate-fare-rounded',
    type: ActionType.RENDER,
    data: {
      src: `${MEXIT_ACTIONS_URL_BASE}/corpbs`
    },
    shortcut: {
      get: {
        title: 'to get',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: '009',
    title: 'Convert Between Currencies',
    category: QuickLinkType.action,
    description: 'Mr. International',
    type: ActionType.RENDER,
    icon: 'bi:currency-exchange',
    data: {
      src: `${MEXIT_ACTIONS_URL_BASE}/currency-convertor`
    },
    shortcut: {
      convert: {
        title: 'to convert',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_CMDT1C7TlZEFyuk54ME6c',
    title: 'About Us',
    category: QuickLinkType.action,
    description: 'Get to know more about Workduck.io',
    type: ActionType.OPEN,
    icon: 'workduck.svg',
    data: { base_url: 'https://workduck.io' },
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  }
]

export const defaultActions: MexitAction[] = initActions

export const searchBrowserAction = (query: string) => {
  return {
    id: '0',
    title: 'Search in Browser Search Bar',
    category: QuickLinkType.action,
    description: `Search for "${query}"`,
    type: ActionType.BROWSER_EVENT,
    icon: 'ph:magnifying-glass',
    data: {
      event_name: 'browser-search',
      query: query
    },
    shortcut: {
      search: {
        title: 'to search',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  } as MexitAction
}
