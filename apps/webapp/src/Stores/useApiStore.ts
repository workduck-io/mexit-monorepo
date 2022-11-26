import create from 'zustand'

export interface RequestData {
  time: number
  url: string
  method: string
  // headers: string;
}

export enum PollActions {
  'hierarchy' = 'hierarchy',
  'shared' = 'shared',
  'bookmarks' = 'bookmarks',
  'snippets' = 'snippets'
}

interface ApiStore {
  polling: Set<PollActions>
  addActionToPoll: (action: PollActions) => void
  replaceAndAddActionToPoll: (action: PollActions) => void
}

export const useApiStore = create<ApiStore>((set, get) => ({
  polling: new Set([PollActions.hierarchy]),
  addActionToPoll: (action: PollActions) => {
    const polling = get().polling
    const newActionsToPoll = polling.add(action)
    set({ polling: newActionsToPoll })
  },
  replaceAndAddActionToPoll: (action: PollActions) => {
    set({ polling: new Set([action]) })
  }
}))
