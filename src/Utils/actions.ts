import { ActionType, MexitAction } from '../Types/Actions'

// TODO: change shortcut keys based on user's OS
export const initActions: Array<MexitAction> = [
  {
    id: '5',
    title: 'Shorten URL',
    description: 'Share this URL as an alias',
    type: ActionType.render,
    data: {
      componentName: 'AliasWrapper'
    }
  },
  {
    id: '1',
    type: ActionType.search,
    title: 'Search Twitter',
    description: 'Search on Twitter',
    data: {
      base_url: 'https://twitter.com/search?q=',
      icon: 'twitter.svg'
    }
  },
  {
    id: '2',
    type: ActionType.open,
    title: 'Open Gmail',
    description: 'Open your default Gmail Account',
    data: {
      base_url: 'https://gmail.com',
      icon: 'gmail.svg'
    }
  },
  {
    id: '3',
    title: 'Reload',
    description: 'Reload current tab',
    type: ActionType.action,
    data: {
      action_name: 'reload',
      icon: 'refresh.svg'
    },
    shortcut: ['Cmd', 'R']
  },
  {
    id: '7',
    title: 'New Google Doc',
    description: 'Create new empty Google Doc with default Google Account',
    type: ActionType.open,
    data: {
      base_url: 'https://docs.new',
      icon: 'google-docs.svg'
    }
  },
  {
    id: '8',
    title: 'New Google Sheet',
    description: 'Create new empty Google Sheet with default Google Account',
    type: ActionType.open,
    data: {
      base_url: 'https://sheets.new',
      icon: 'google-sheets.svg'
    }
  },
  {
    id: '9',
    title: 'New Google Slides',
    description: 'Create new empty Google Slides with default Google Account',
    type: ActionType.open,
    data: {
      base_url: 'https://slides.new',
      icon: 'google-slides.svg'
    }
  },
  {
    id: '10',
    title: 'New GitHub Gist',
    description: 'Create new GitHub Gist',
    type: ActionType.open,
    data: {
      base_url: 'https://gist.new',
      icon: 'gist.svg'
    }
  },
  {
    id: '11',
    title: 'New GitHub Repo',
    description: 'Create new GitHub Repository',
    type: ActionType.open,
    data: {
      base_url: 'https://repo.new',
      icon: 'github.svg'
    }
  },
  {
    id: '12',
    title: 'New Figma File',
    description: 'Create new empty Figma File',
    type: ActionType.open,
    data: {
      base_url: 'https://figma.new',
      icon: 'figma.svg'
    }
  },
  {
    id: '18',
    title: 'New Linear issue',
    description: 'Create a new Linear issue',
    type: ActionType.open,
    data: {
      base_url: 'https://linear.new',
      icon: 'linear.png'
    }
  },
  {
    id: '19',
    title: 'New Notion page',
    description: 'Create a new Notion page',
    type: ActionType.open,
    data: {
      base_url: 'https://notion.new',
      icon: 'notion.svg'
    }
  },
  {
    id: '20',
    title: 'New Google form',
    description: 'Create a new Google form',
    type: ActionType.open,
    data: {
      base_url: 'https://forms.new',
      icon: 'google-form.svg'
    }
  },
  {
    id: '21',
    title: 'New Tweet',
    description: 'Make a new Tweet',
    type: ActionType.open,
    data: {
      base_url: 'https://twitter.com/intent/tweet',
      icon: 'twitter.svg'
    }
  },
  {
    id: '22',
    title: 'Downloads',
    description: 'Browse through your downloads',
    type: ActionType.action,
    data: {
      action_name: 'chrome-url',
      base_url: 'chrome://downloads',
      icon: 'downloads.svg'
    }
  },
  {
    id: '23',
    title: 'Extensions',
    description: 'Manage your chrome extensions',
    type: ActionType.action,
    data: {
      action_name: 'chrome-url',
      base_url: 'chrome://extensions',
      icon: 'extension.svg'
    }
  },
  {
    id: '13',
    title: 'Search Gmail',
    description: 'Search within your default Gmail Account',
    type: ActionType.search,
    data: {
      base_url: 'https://mail.google.com/mail/#search/',
      icon: 'gmail.svg'
    }
  },
  {
    id: '14',
    title: 'Search Wikipedia',
    description: 'Search on Wikipedia',
    type: ActionType.search,
    data: {
      base_url: 'http://en.wikipedia.org/?search=',
      icon: 'wikipedia.svg'
    }
  },
  {
    id: '15',
    title: 'Search YouTube',
    description: 'Search on YouTube',
    type: ActionType.search,
    data: {
      base_url:
        'http://www.youtube.com/results?search_type=search_videos&search_sort=relevance&search=Search&search_query=',
      icon: 'youtube.svg'
    }
  },
  {
    id: '16',
    title: 'Search Google Drive',
    description: 'Search Google Drive on default Google Account',
    type: ActionType.search,
    data: {
      base_url: 'https://drive.google.com/drive/search?q=',
      icon: 'google-drive.svg'
    }
  },
  {
    id: '17',
    title: 'Search GitHub',
    description: 'Search on GitHub',
    type: ActionType.search,
    data: {
      base_url: 'https://github.com/search?ref=opensearch&q=',
      icon: 'github.svg'
    }
  },
  {
    id: '24',
    title: 'Clear browsing history',
    description: 'Clear all of your browsing history',
    type: ActionType.action,
    data: {
      action_name: 'remove-history',
      icon: 'delete-history.png'
    }
  },
  {
    id: '25',
    title: 'Clear Cache',
    description: 'Clear all the cache',
    type: ActionType.action,
    data: {
      action_name: 'remove-cache',
      icon: 'cache.png'
    }
  },
  {
    id: '26',
    title: 'Clear Cookies',
    description: 'Clear all cookies',
    type: ActionType.action,
    data: {
      action_name: 'remove-cookies',
      icon: 'cookies.png'
    }
  },
  {
    id: '6',
    title: 'Clear Local Storage',
    type: ActionType.action,
    data: {
      action_name: 'remove-local-storage',
      icon: 'storage.png'
    },
    shortcut: ['Cmd', 'D']
  },
  {
    id: '4',
    title: 'About Us',
    description: 'Get to know more about Workduck.io',
    type: ActionType.open,
    data: {
      base_url: 'https://workduck.io',
      icon: 'workduck.svg'
    }
  }
]

export const defaultActions: MexitAction[] = initActions

export const searchBrowserAction = (query: string) => {
  return {
    id: '0',
    title: 'Search in Browser Search Bar',
    description: "Perform a search in your browser's URL Bar!",
    type: ActionType.action,
    data: {
      action_name: 'browser-search',
      query: query,
      icon: 'search.svg'
    }
  }
}
