import { ActionType, MexitAction } from '../Types/Actions'

// TODO: change shortcut keys based on user's OS
export const initActions: Array<MexitAction> = [
  {
    id: 'ACTION_LHQhtM9eA3avcNvy8RYgS',
    title: 'Shorten URL',
    description: 'Share this URL as an alias',
    type: ActionType.RENDER,
    data: { componentName: 'AliasWrapper' }
  },
  {
    id: 'ACTION_zQZg48LsKubhbZzVvNyZX',
    type: ActionType.SEARCH,
    title: 'Search Twitter',
    description: 'Search on Twitter',
    data: { base_url: 'https://twitter.com/search?q=', icon: 'twitter.svg' }
  },
  {
    id: 'ACTION__JZ7DbTRtgVyUWIZ6Rvjs',
    type: ActionType.OPEN,
    title: 'Open Gmail',
    description: 'Open your default Gmail Account',
    data: { base_url: 'https://gmail.com', icon: 'gmail.svg' }
  },
  {
    id: 'ACTION_G7vQElzF0MXhcRVCJsoIP',
    title: 'Reload',
    description: 'Reload current tab',
    type: ActionType.BROWSER_EVENT,
    data: { event_name: 'reload', icon: 'refresh.svg' },
    shortcut: ['Cmd', 'R']
  },
  {
    id: 'ACTION_nlTaC5-ZcMXgaJrNg_NfL',
    title: 'New Google Doc',
    description: 'Create new empty Google Doc with default Google Account',
    type: ActionType.OPEN,
    data: { base_url: 'https://docs.new', icon: 'google-docs.svg' }
  },
  {
    id: 'ACTION_H77GDKfBFVriXpplM-b1x',
    title: 'New Google Sheet',
    description: 'Create new empty Google Sheet with default Google Account',
    type: ActionType.OPEN,
    data: { base_url: 'https://sheets.new', icon: 'google-sheets.svg' }
  },
  {
    id: 'ACTION_gpymSN3oEOd4gfCdfwK4E',
    title: 'New Google Slides',
    description: 'Create new empty Google Slides with default Google Account',
    type: ActionType.OPEN,
    data: { base_url: 'https://slides.new', icon: 'google-slides.svg' }
  },
  {
    id: 'ACTION_XGHlAYLbMrcROQbgIJMBl',
    title: 'New GitHub Gist',
    description: 'Create new GitHub Gist',
    type: ActionType.OPEN,
    data: { base_url: 'https://gist.new', icon: 'gist.svg' }
  },
  {
    id: 'ACTION_WMORyqSCI5gdYq-0ZEXTx',
    title: 'New GitHub Repo',
    description: 'Create new GitHub Repository',
    type: ActionType.OPEN,
    data: { base_url: 'https://repo.new', icon: 'github.svg' }
  },
  {
    id: 'ACTION_30FPylVvxZDAfeoyTdxOY',
    title: 'New Figma File',
    description: 'Create new empty Figma File',
    type: ActionType.OPEN,
    data: { base_url: 'https://figma.new', icon: 'figma.svg' }
  },
  {
    id: 'ACTION_w5lK-B2y5p8-vxuq-254_',
    title: 'New Linear issue',
    description: 'Create a new Linear issue',
    type: ActionType.OPEN,
    data: { base_url: 'https://linear.new', icon: 'linear.png' }
  },
  {
    id: 'ACTION_dh7Hq50UFvK3LQP5_E-70',
    title: 'New Notion page',
    description: 'Create a new Notion page',
    type: ActionType.OPEN,
    data: { base_url: 'https://notion.new', icon: 'notion.svg' }
  },
  {
    id: 'ACTION_2vWe76dH6sXpxOH081X7J',
    title: 'New Google form',
    description: 'Create a new Google form',
    type: ActionType.OPEN,
    data: { base_url: 'https://forms.new', icon: 'google-form.svg' }
  },
  {
    id: 'ACTION_o1LA-TFz5-szRUaMPSsqh',
    title: 'New Tweet',
    description: 'Make a new Tweet',
    type: ActionType.OPEN,
    data: {
      base_url: 'https://twitter.com/intent/tweet',
      icon: 'twitter.svg'
    }
  },
  {
    id: 'ACTION_RIVhQLkDOJiApxuM6l7gE',
    title: 'Downloads',
    description: 'Browse through your downloads',
    type: ActionType.BROWSER_EVENT,
    data: {
      event_name: 'chrome-url',
      base_url: 'chrome://downloads',
      icon: 'downloads.svg'
    }
  },
  {
    id: 'ACTION_u1Fc119Vi69v1Ag-HKU0Y',
    title: 'Extensions',
    description: 'Manage your chrome extensions',
    type: ActionType.BROWSER_EVENT,
    data: {
      event_name: 'chrome-url',
      base_url: 'chrome://extensions',
      icon: 'extension.svg'
    }
  },
  {
    id: 'ACTION_vUiFbCMGsoJxOHhh6m3IT',
    title: 'Search Gmail',
    description: 'Search within your default Gmail Account',
    type: ActionType.SEARCH,
    data: {
      base_url: 'https://mail.google.com/mail/#search/',
      icon: 'gmail.svg'
    }
  },
  {
    id: 'ACTION_DhQ9ozhUTXPTmfkHncMiH',
    title: 'Search Wikipedia',
    description: 'Search on Wikipedia',
    type: ActionType.SEARCH,
    data: {
      base_url: 'http://en.wikipedia.org/?search=',
      icon: 'wikipedia.svg'
    }
  },
  {
    id: 'ACTION_QKur_eR3JVLNCX-gwkeGW',
    title: 'Search YouTube',
    description: 'Search on YouTube',
    type: ActionType.SEARCH,
    data: {
      base_url:
        'http://www.youtube.com/results?search_type=search_videos&search_sort=relevance&search=Search&search_query=',
      icon: 'youtube.svg'
    }
  },
  {
    id: 'ACTION_JWOtwPiaMnyL_RVgT3Jn7',
    title: 'Search Google Drive',
    description: 'Search Google Drive on default Google Account',
    type: ActionType.SEARCH,
    data: {
      base_url: 'https://drive.google.com/drive/search?q=',
      icon: 'google-drive.svg'
    }
  },
  {
    id: 'ACTION_A6VLKiPZeHGw0EFq-dtV7',
    title: 'Search GitHub',
    description: 'Search on GitHub',
    type: ActionType.SEARCH,
    data: {
      base_url: 'https://github.com/search?ref=opensearch&q=',
      icon: 'github.svg'
    }
  },
  {
    id: 'ACTION_CMDT1C7TlZEFyuk54ME6c',
    title: 'About Us',
    description: 'Get to know more about Workduck.io',
    type: ActionType.OPEN,
    data: { base_url: 'https://workduck.io', icon: 'workduck.svg' }
  },
  {
    id: 'ACTION_t4Gbp9x7f6jmkKBALbYQ4',
    title: 'Capture Multiple Tabs',
    description: 'Save a group of tabs to retrieve later',
    type: ActionType.RENDER,
    data: {
      componentName: 'CreateTabCapture'
    }
  },
  {
    id: 'ACTION_t4Gbp9x7f6jmkKB3LbYQ5',
    title: 'Show Captured Tab Groups',
    description: 'List and Open Tab Saved Tab Groups',
    type: ActionType.RENDER,
    data: {
      componentName: 'ShowTabCaptures'
    }
  },
  {
    id: 'ACTION_9x7f6jmkKB3LbYQ5t4Gbp',
    title: 'Colour Picker',
    description: "Pretend you're a designer and steal some colours",
    type: ActionType.RENDER,
    data: {
      componentName: 'ColourPicker'
    }
  },
  {
    id: 'ACTION_9x7LbYQ5t4Gbpf6jmkKB3',
    title: 'Unix Epoch Converter',
    description: 'Convert Epoch Timestamp to Datetime and vice versa',
    type: ActionType.RENDER,
    data: {
      componentName: 'UnixEpochConverter'
    }
  },
  {
    id: '007',
    title: 'Corporate Buzzwords',
    description: 'Gimme some Corporate BS Buzzwords',
    type: ActionType.RENDER,
    data: {
      componentName: 'CorporateBS'
    }
  },
  // {
  //   id: '008',
  //   title: 'Translate Between Languages',
  //   description: 'Google Translate, but worse',
  //   type: ActionType.RENDER,
  //   data: {
  //     componentName: 'LibreTranslate'
  //   }
  // }
  {
    id: '009',
    title: 'Convert Between Currencies',
    description: 'Mr. International',
    type: ActionType.RENDER,
    data: {
      componentName: 'CurrencyConverter'
    }
  }
]

export const defaultActions: MexitAction[] = initActions

export const searchBrowserAction = (query: string) => {
  return {
    id: '0',
    title: 'Search in Browser Search Bar',
    description: "Perform a search in your browser's URL Bar!",
    type: ActionType.BROWSER_EVENT,
    data: {
      event_name: 'browser-search',
      query: query,
      icon: 'search.svg'
    }
  }
}
