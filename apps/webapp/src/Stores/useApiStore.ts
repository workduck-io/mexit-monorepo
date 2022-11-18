import { sub } from 'date-fns'
import create from 'zustand'
import { persist } from 'zustand/middleware'

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
  requests: { [URL: string]: RequestData }
  setRequest(url: string, data: RequestData): void
  clearRequests(): void
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
  },

  requests: {},
  setRequest(url, data) {
    set({
      requests: {
        ...get().requests,
        [url]: data
      }
    })
  },
  clearRequests() {
    set({
      requests: {}
    })
  }
}))

export const isRequestedWithin = (minutes: number, url: string) => {
  const now = Date.now()
  const backMinutes = sub(now, { minutes })

  const requests = useApiStore.getState().requests
  const request = requests[url]
  if (!request) return false
  return request.time > backMinutes.getTime()
}
