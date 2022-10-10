import { ActionType, MexitAction } from '../Types/Actions'
import { CategoryType, QuickLinkType } from '../Types/Editor'
import { ListItemType } from '../Types/List'
import { MEXIT_ACTIONS_URL_BASE } from '../Utils/routes'

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
    },
    save: {
      category: 'action',
      keystrokes: '$mod+Enter',
      title: 'to save'
    }
  },
  extras: {
    new: true
  }
}

// TODO: change shortcut keys based on user's OS
export const initActions: Array<ListItemType> = [
  {
    id: 'ACTION_1',
    title: 'Capture Screenshot',
    category: QuickLinkType.action,
    description: 'Capture tab screenshot',
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
    id: 'ACTION_9x34kgj23j4234ojin',
    title: 'Metadata Aggregator',
    category: QuickLinkType.action,
    icon: 'eva:color-picker-fill',
    description: 'Extract any useful data from the current page',
    type: ActionType.MAGICAL,
    shortcut: {
      pick: {
        title: 'to pick',
        category: 'action',
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
    extras: { base_url: `${MEXIT_ACTIONS_URL_BASE}/shortener` }
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
    extras: { base_url: 'https://twitter.com/search?q=' }
  },
  {
    id: 'ACTION__JZ7DbTRtgVyUWIZ6Rvjs',
    type: ActionType.OPEN,
    title: 'Open Gmail',
    category: QuickLinkType.action,
    description: 'Open your Gmail account',
    icon: 'simple-icons:gmail',
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    },
    extras: { base_url: 'https://gmail.com' }
  },
  {
    id: 'ACTION_G7vQElzF0MXhcRVCJsoIP',
    title: 'Reload',
    category: QuickLinkType.action,
    description: 'Reload current tab',
    type: ActionType.BROWSER_EVENT,
    icon: 'eva:refresh-outline',
    shortcut: {
      reload: {
        title: 'to reload',
        category: 'action',
        keystrokes: 'Enter'
      }
    },
    extras: { event_name: 'reload' }
  },
  {
    id: 'ACTION_nlTaC5-ZcMXgaJrNg_NfL',
    title: 'New Google Doc',
    category: QuickLinkType.action,
    description: 'Create new Google Doc',
    type: ActionType.OPEN,
    icon: 'material-symbols:docs',
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    },
    extras: { base_url: 'https://docs.new' }
  },
  {
    id: 'ACTION_H77GDKfBFVriXpplM-b1x',
    title: 'New Google Sheet',
    category: QuickLinkType.action,
    description: 'Create new Google Sheet',
    type: ActionType.OPEN,
    icon: 'simple-icons:googlesheets',
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    },
    extras: { base_url: 'https://sheets.new' }
  },
  {
    id: 'ACTION_gpymSN3oEOd4gfCdfwK4E',
    title: 'New Google Slides',
    category: QuickLinkType.action,
    description: 'Create new Google Slides',
    type: ActionType.OPEN,
    icon: 'material-symbols:slides',
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    },
    extras: { base_url: 'https://slides.new' }
  },
  {
    id: 'ACTION_XGHlAYLbMrcROQbgIJMBl',
    title: 'New GitHub Gist',
    category: QuickLinkType.action,
    description: 'Create new GitHub Gist',
    type: ActionType.OPEN,
    icon: 'bi:github',
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    },
    extras: { base_url: 'https://gist.new' }
  },
  {
    id: 'ACTION_WMORyqSCI5gdYq-0ZEXTx',
    title: 'New GitHub Repo',
    category: QuickLinkType.action,
    description: 'Create new GitHub Repository',
    type: ActionType.OPEN,
    icon: 'bi:github',
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    },
    extras: { base_url: 'https://repo.new' }
  },
  {
    id: 'ACTION_30FPylVvxZDAfeoyTdxOY',
    title: 'New Figma File',
    category: QuickLinkType.action,
    description: 'Create new empty Figma File',
    type: ActionType.OPEN,
    icon: 'ph:figma-logo-fill',
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    },

    extras: { base_url: 'https://figma.new' }
  },
  {
    id: 'ACTION_w5lK-B2y5p8-vxuq-254_',
    title: 'New Linear issue',
    category: QuickLinkType.action,
    description: 'Create a new Linear issue',
    type: ActionType.OPEN,
    icon: 'gg:linear',
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    },
    extras: { base_url: 'https://linear.new' }
  },
  {
    id: 'ACTION_dh7Hq50UFvK3LQP5_E-70',
    title: 'New Notion page',
    category: QuickLinkType.action,
    description: 'Create a new Notion page',
    type: ActionType.OPEN,
    icon: 'simple-icons:notion',
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    },
    extras: { base_url: 'https://notion.new' }
  },
  {
    id: 'ACTION_2vWe76dH6sXpxOH081X7J',
    title: 'New Google form',
    category: QuickLinkType.action,
    description: 'Create a new Google form',
    type: ActionType.OPEN,
    icon: 'ri:drive-fill',
    shortcut: {
      open: {
        title: 'to open',
        category: 'action',
        keystrokes: 'Enter'
      }
    },
    extras: { base_url: 'https://forms.new' }
  },
  {
    id: 'ACTION_o1LA-TFz5-szRUaMPSsqh',
    title: 'New Tweet',
    category: QuickLinkType.action,
    description: 'Make a new Tweet',
    type: ActionType.OPEN,
    icon: 'bi:twitter',
    extras: {
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
    extras: {
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
    extras: {
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
    description: 'Search on Gmail',
    type: ActionType.SEARCH,
    icon: 'simple-icons:gmail',
    shortcut: {
      search: {
        category: 'action',
        title: 'to search',
        keystrokes: 'Enter'
      }
    },
    extras: {
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
    extras: {
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
    extras: {
      base_url:
        'http://www.youtube.com/results?search_type=search_videos&search_sort=relevance&search=Search&search_query='
    }
  },
  {
    id: 'ACTION_JWOtwPiaMnyL_RVgT3Jn7',
    title: 'Search Google Drive',
    category: QuickLinkType.action,
    description: 'Search on Google Drive',
    type: ActionType.SEARCH,
    icon: 'ri:drive-fill',
    shortcut: {
      search: {
        category: 'action',
        title: 'to search',
        keystrokes: 'Enter'
      }
    },
    extras: {
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
    extras: {
      base_url: 'https://github.com/search?ref=opensearch&q='
    }
  },
  {
    id: 'ACTION_t4Gbp9x7f6jmkKBALbYQ4',
    title: 'Capture Multiple Tabs',
    icon: 'bi:collection-fill',
    category: QuickLinkType.action,
    description: 'Save a group of tabs',
    type: ActionType.RENDER,
    shortcut: {
      capture: {
        category: 'action',
        title: 'to capture',
        keystrokes: 'Enter'
      }
    },
    extras: {
      componentName: 'CreateTabCapture'
    }
  },
  // {
  //   id: 'ACTION_t4Gbp9x7f6jmkKB3LbYQ5',
  //   title: 'Show Captured Tab Groups',
  //   description: 'List and Open Tab Saved Tab Groups',
  //   type: ActionType.RENDER,
  //   extras: {
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
    extras: {
      base_url: `${MEXIT_ACTIONS_URL_BASE}/color-picker`
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
    extras: {
      base_url: `${MEXIT_ACTIONS_URL_BASE}/epoch`
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
    extras: {
      base_url: `${MEXIT_ACTIONS_URL_BASE}/corpbs`
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
    id: 'ACTION_CMDT1C7TlZEFyuk54ME6c',
    title: 'About Us',
    category: QuickLinkType.action,
    description: 'Get to know more about Workduck.io',
    type: ActionType.OPEN,
    icon: 'workduck.svg',
    extras: { base_url: 'https://workduck.io' },
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
export const MAX_RECENT_ITEMS = 3

export const searchBrowserAction = (query: string, activeItem?: MexitAction) => {
  return {
    id: '0',
    title: activeItem?.title || 'Search in Browser Search Bar',
    category: QuickLinkType.action,
    description: `Search for ${query}`,
    type: ActionType.SEARCH,
    icon: activeItem?.icon || 'ph:magnifying-glass',
    extras: {
      base_url: activeItem?.data?.base_url || 'https://google.com/search?q='
    },
    shortcut: {
      search: {
        title: 'to search',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  } as ListItemType
}
