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
    id: '4',
    title: 'About Us',
    description: 'Get to know more about Workduck.io',
    type: ActionType.open,
    data: {
      base_url: 'https://workduck.io',
      icon: 'workduck.svg'
    }
  },
  {
    id: '6',
    title: 'Clear Local Storage',
    type: ActionType.action,
    data: {
      action_name: 'remove-local-storage'
    },
    shortcut: ['Cmd', 'D']
  }
]

export const defaultActions: MexitAction[] = initActions
