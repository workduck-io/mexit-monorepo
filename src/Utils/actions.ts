import Shortener from '../Components/Shortener'
import { ActionType, MexitAction } from '../Types/Actions'

// TODO: change shortcut keys based on user's OS
export const initActions: Array<MexitAction> = [
  {
    id: '1',
    type: ActionType.search,
    title: 'Search Twitter',
    description: 'Search on Twitter',
    data: {
      base_url: 'https://twitter.com/search?q='
    }
  },
  {
    id: '2',
    type: ActionType.open,
    title: 'Open Gmail',
    data: {
      base_url: 'https://gmail.com'
    }
  },
  {
    id: '3',
    title: 'Reload',
    description: 'Reload current tab',
    type: ActionType.action,
    data: {
      action_name: 'reload'
    },
    shortcut: ['Cmd', 'R']
  },
  {
    id: '4',
    title: 'About Us',
    description: 'Get to know more about Workduck.io',
    type: ActionType.open,
    data: {
      base_url: 'https://workduck.io'
    }
  },
  {
    id: '5',
    title: 'Shorten URL',
    description: 'Share this URL as an alias',
    type: ActionType.render,
    data: {
      component: Shortener
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

export const defaultActions: MexitAction[] = initActions.slice(1, 4)
