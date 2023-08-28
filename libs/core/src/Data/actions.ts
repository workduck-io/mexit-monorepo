import { ActionType, MexitAction } from '../Types/Actions'
import { QuickLinkType } from '../Types/Editor'
import { ListItemType } from '../Types/List'
import { DefaultMIcons, getMIcon } from '../Types/Store'
import { API_BASE_URLS } from '../Utils/routes'

export const CREATE_NEW_ITEM: ListItemType = {
  title: 'Create new ',
  id: 'create-new-node',
  icon: getMIcon('ICON', 'bi:plus-circle'),
  category: QuickLinkType.backlink,
  description: 'Quick note',
  shortcut: {
    edit: {
      category: 'action',
      keystrokes: 'Enter',
      title: 'to Create'
    }
  },
  extras: {
    new: true,
    newItemType: 'note'
  }
}

export const HIGHLIGHT_ACTION: ListItemType = {
  title: 'Highlight',
  id: 'highlight-action',
  icon: DefaultMIcons.HIGHLIGHT,
  description: 'Highlight current selection',
  category: QuickLinkType.action,
  type: ActionType.HIGHLIGHT,
  shortcut: {
    highlight: {
      category: 'action',
      keystrokes: 'Enter',
      title: 'to highlight'
    }
  }
}

export const CREATE_NEW_SNIPPET: ListItemType = {
  title: 'Create new ',
  id: 'create-new-snippet',
  icon: DefaultMIcons.SNIPPET,
  category: QuickLinkType.backlink,
  description: 'Quick Snippet',
  shortcut: {
    edit: {
      category: 'action',
      keystrokes: 'Enter',
      title: 'to Create'
    }
  },
  extras: {
    new: true,
    newItemType: 'snippet'
  }
}

export const SmartCaptureAction = {
  id: 'ACTION_9x34kgj23j4234ojin',
  title: 'Smart Capture',
  category: QuickLinkType.action,
  icon: getMIcon('ICON', 'fluent:screen-search-24-filled'),
  description: 'Smartly captures any useful data from the current page',
  type: ActionType.MAGICAL,
  shortcut: {
    pick: {
      title: 'to pick',
      category: 'action',
      keystrokes: 'Enter'
    }
  }
}

export const initActions: Array<ListItemType> = [
  {
    id: 'ACTION_LHQhtM9eA3avcNvy8RYgS',
    title: 'Shorten URL',
    category: QuickLinkType.action,
    description: 'Share this URL as an alias',
    type: ActionType.RENDER,
    icon: getMIcon('ICON', 'ri:link'),
    shortcut: {
      shorten: {
        title: 'to shorten',
        category: 'action',
        keystrokes: 'Enter'
      }
    },
    extras: { base_url: `${API_BASE_URLS.actions}/shortener` }
  },
  SmartCaptureAction,
  {
    id: 'ACTION_1',
    title: 'Take Screenshot',
    category: QuickLinkType.action,
    description: 'Takes screenshot of current tab',
    type: ActionType.SCREENSHOT,
    icon: getMIcon('ICON', 'bx:screenshot'),
    shortcut: {
      capture: {
        category: 'action',
        title: 'to capture',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_9aoweruw2321bub',
    title: 'Lorem Ipsum',
    category: QuickLinkType.action,
    icon: getMIcon('ICON', 'bi:text-paragraph'),
    description: 'Generate placeholder content',
    type: ActionType.LOREM_IPSUM,
    shortcut: {
      copy: {
        title: 'to copy',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION__JZ7DbTRtgVyUWIZ6Rvjs',
    type: ActionType.OPEN,
    title: 'Open Gmail',
    category: QuickLinkType.action,
    description: 'Open your Gmail account',
    icon: getMIcon('ICON', 'simple-icons:gmail'),
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
    id: 'ACTION_30FPylVvxZDAfeoyTdxOY',
    title: 'New Figma File',
    category: QuickLinkType.action,
    description: 'Create new empty Figma File',
    type: ActionType.OPEN,
    icon: getMIcon('ICON', 'ph:figma-logo-fill'),
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
    icon: getMIcon('ICON', 'gg:linear'),
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
    title: 'Search in Mex',
    id: 'ACTION_A6VLKiPZeHGw0EFq_1mex',
    icon: getMIcon('ICON', 'ph:magnifying-glass'),
    category: QuickLinkType.action,
    type: ActionType.SEARCH,
    description: 'Searchs query in Mex',
    shortcut: {
      search: {
        category: 'action',
        keystrokes: 'Enter',
        title: 'to search'
      }
    },
    extras: {
      withinMex: true
    }
  },
  {
    id: 'ACTION_zQZg48LsKubhbZzVvNyZX',
    type: ActionType.SEARCH,
    category: QuickLinkType.action,
    title: 'Search Twitter',
    description: 'Search on Twitter',
    icon: getMIcon('ICON', 'bi:twitter'),
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
    id: 'ACTION_4d32gtj23agex34ojin',
    title: 'Toggle Sidebar',
    category: QuickLinkType.action,
    type: ActionType.RIGHT_SIDEBAR,
    icon: getMIcon('ICON', 'codicon:layout-sidebar-right'),
    shortcut: {
      toggle: {
        category: 'action',
        title: 'to toggle',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_9234nueb23uXoerIHF',
    title: 'Avatar Generator',
    category: QuickLinkType.action,
    icon: getMIcon('ICON', 'material-symbols:account-box'),
    description: 'Generate random avatar image',
    type: ActionType.AVATAR_GENERATOR,
    shortcut: {
      generate: {
        title: 'to generate',
        category: 'action',
        keystrokes: 'Enter'
      }
    }
  },
  {
    id: 'ACTION_G7vQElzF0MXhcRVCJsoIP',
    title: 'Reload',
    category: QuickLinkType.action,
    description: 'Reload current tab',
    type: ActionType.BROWSER_EVENT,
    icon: getMIcon('ICON', 'eva:refresh-outline'),
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
    id: 'ACTION_TOGGLE_SPOTLIGHT',
    title: 'Toggle Extension',
    category: QuickLinkType.action,
    type: ActionType.TOGGLE,
    icon: getMIcon('ICON', 'mdi:nintendo-switch'),
    shortcut: {
      shorten: {
        title: 'to Toggle',
        category: 'action',
        keystrokes: '$mod+Backslash'
      }
    }
  },
  {
    id: 'ACTION_nlTaC5-ZcMXgaJrNg_NfL',
    title: 'New Google Doc',
    category: QuickLinkType.action,
    description: 'Create new Google Doc',
    type: ActionType.OPEN,
    icon: getMIcon('ICON', 'material-symbols:docs'),
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
    icon: getMIcon('ICON', 'simple-icons:googlesheets'),
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
    icon: getMIcon('ICON', 'material-symbols:slides'),
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
    icon: getMIcon('ICON', 'bi:github'),
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
    icon: getMIcon('ICON', 'bi:github'),
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
    id: 'ACTION_dh7Hq50UFvK3LQP5_E-70',
    title: 'New Notion page',
    category: QuickLinkType.action,
    description: 'Create a new Notion page',
    type: ActionType.OPEN,
    icon: getMIcon('ICON', 'simple-icons:notion'),
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
    icon: getMIcon('ICON', 'ri:drive-fill'),
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
    icon: getMIcon('ICON', 'bi:twitter'),
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
    icon: getMIcon('ICON', 'bx:download'),
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
    icon: getMIcon('ICON', 'bx:extension'),
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
    icon: getMIcon('ICON', 'simple-icons:gmail'),
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
    icon: getMIcon('ICON', 'simple-icons:wikipedia'),
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
    icon: getMIcon('ICON', 'bi:youtube'),
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
    icon: getMIcon('ICON', 'ri:drive-fill'),
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
    id: 'ACTION_A6VLKiPZeHGw0EFq_dtV7',
    title: 'Search GitHub',
    category: QuickLinkType.action,
    description: 'Search on GitHub',
    type: ActionType.SEARCH,
    icon: getMIcon('ICON', 'bi:github'),
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
  // * Cool feature, but not for PH launch
  // {
  //   id: 'ACTION_t4Gbp9x7f6jmkKBALbYQ4',
  //   title: 'Capture Multiple Tabs',
  //   icon: getMIcon('ICON', 'bi:collection-fill'),
  //   category: QuickLinkType.action,
  //   description: 'Save a group of tabs',
  //   type: ActionType.RENDER,
  //   shortcut: {
  //     capture: {
  //       category: 'action',
  //       title: 'to capture',
  //       keystrokes: 'Enter'
  //     }
  //   },
  //   extras: {
  //     componentName: 'CreateTabCapture'
  //   }
  // },
  // * Uncomment this
  // {
  //   id: 'ACTION_t4Gbp9x7f6jmkKB3LbYQ5',
  //   title: 'Show Captured Tab Groups',
  //   description: 'List and Open Tab Saved Tab Groups',
  //   type: ActionType.RENDER,
  //   extras: {
  //     componentName: 'ShowTabCaptures'
  //   }
  // },
  // {
  //   id: 'ACTION_9x7f6jmkKB3LbYQ5t4Gbp',
  //   title: 'Colour Picker',
  //   category: QuickLinkType.action,
  //   icon: getMIcon('ICON', 'eva:color-picker-fill'),
  //   description: "Pretend you're a designer and steal some colours",
  //   type: ActionType.RENDER,
  //   extras: {
  //     base_url: `${MEXIT_ACTIONS_URL_BASE}/color-picker`
  //   },
  //   shortcut: {
  //     pick: {
  //       title: 'to pick',
  //       category: 'action',
  //       keystrokes: 'Enter'
  //     }
  //   }
  // },
  // {
  //   id: 'ACTION_9x7LbYQ5t4Gbpf6jmkKB3',
  //   title: 'Unix Epoch Converter',
  //   category: QuickLinkType.action,
  //   description: 'Convert Epoch Timestamp to Datetime and vice versa',
  //   icon: getMIcon('ICON', 'material-symbols:date-range'),
  //   type: ActionType.RENDER,
  //   extras: {
  //     base_url: `${MEXIT_ACTIONS_URL_BASE}/epoch`
  //   },
  //   shortcut: {
  //     convert: {
  //       title: 'to convert',
  //       category: 'action',
  //       keystrokes: 'Enter'
  //     }
  //   }
  // },
  {
    id: '007',
    title: 'Corporate Buzzwords',
    category: QuickLinkType.action,
    description: 'Gimme some Corporate BS Buzzwords',
    icon: getMIcon('ICON', 'material-symbols:corporate-fare-rounded'),
    type: ActionType.RENDER,
    extras: {
      base_url: `${API_BASE_URLS.actions}/corpbs`
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
    icon: getMIcon('MEX'),
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
    icon: activeItem?.icon || getMIcon('ICON', 'ph:magnifying-glass'),
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

export const loremIpsum = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin fringilla justo at rutrum. Morbi consequat non mi sit amet molestie. Aliquam pretium ultricies finibus. Integer mi felis, consequat vitae tempor vel, efficitur non quam. Praesent eu lacus augue. Etiam finibus tortor id dui varius facilisis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur imperdiet a turpis auctor bibendum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla vel nulla metus.',
  'Fusce facilisis nisi et condimentum vestibulum. Quisque egestas semper nibh, gravida bibendum risus ornare vel. Suspendisse ut velit eu ipsum condimentum congue. Quisque id blandit magna, a pharetra quam. Suspendisse laoreet odio eu nisi tristique lobortis. Vestibulum luctus massa id velit venenatis, posuere sodales elit congue. Nulla nec dictum est, at lacinia erat. Donec quis mauris ut turpis semper dapibus. Duis tincidunt malesuada felis vitae vehicula. Vestibulum lacinia massa at est lobortis, ut molestie leo egestas. Ut faucibus urna vel ante aliquam bibendum. Curabitur porttitor auctor accumsan. Nulla dapibus libero ac elit convallis, in molestie velit facilisis. Pellentesque rhoncus viverra velit, non fermentum augue sollicitudin vulputate.',
  'Donec efficitur est nec ipsum pharetra, congue vulputate ex venenatis. Nulla facilisi. Aliquam congue velit iaculis congue iaculis. Ut a blandit lectus. Etiam congue, sapien eget tempor placerat, nibh sapien vehicula erat, non pellentesque sem turpis vitae est. Integer tincidunt dignissim elit ut accumsan. In rutrum risus nisi, in consectetur eros lobortis vitae. Morbi molestie felis non orci elementum rutrum. Nunc velit ligula, tempor in dui vitae, ultricies tincidunt dui. Praesent ullamcorper luctus nisl, sit amet semper orci vehicula sit amet. In sagittis lacus lorem, nec semper urna convallis ut. Aliquam erat volutpat. Maecenas non pellentesque lacus. Suspendisse tempor diam et dictum dignissim. Vestibulum urna augue, congue at finibus non, bibendum quis velit.',
  'Etiam non felis vel leo ullamcorper vehicula. Ut tincidunt, turpis quis dignissim vulputate, libero est sagittis lacus, quis ultricies dolor purus ac risus. Suspendisse at bibendum dolor, dictum luctus turpis. Sed hendrerit convallis ex, vel molestie dolor cursus vitae. Pellentesque varius ut sapien sit amet vestibulum. Quisque scelerisque ipsum ex, sed sodales nisi rhoncus vitae. Sed metus tellus, egestas in tristique id, laoreet quis sem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed et justo nec dui ultricies scelerisque sed ac magna. Duis luctus auctor mi nec consequat. Sed justo ante, fringilla eu tellus vitae, dictum pharetra dolor. Aenean a consectetur tortor. Morbi in vulputate ante. Quisque dui augue, suscipit a malesuada ut, iaculis in tellus. Nulla ac rutrum urna',
  'In eget lectus ut ipsum ultrices elementum quis suscipit ipsum. Vivamus congue, dolor sed sodales interdum, urna dui finibus ipsum, at scelerisque odio ante faucibus quam. Phasellus augue orci, lobortis sed sapien ac, ullamcorper dapibus massa. Curabitur commodo dui ut augue gravida viverra. Quisque volutpat faucibus condimentum. Integer auctor velit non pharetra varius. Mauris elit nunc, pharetra ut porttitor vel, congue sit amet lorem. Morbi malesuada diam velit, nec posuere metus iaculis ac. Vestibulum facilisis dui libero. Fusce convallis sem id dignissim viverra. Quisque vehicula sagittis tellus vel mattis. Phasellus molestie suscipit tortor, sit amet mattis tortor. Ut tincidunt, orci sit amet egestas consectetur, arcu libero vestibulum lectus, quis fringilla neque est ut arcu. Quisque non luctus mi, cursus lobortis neque. Duis nunc metus, sollicitudin sit amet odio interdum, ultrices elementum mi.'
]
