import { CalendarProviderType } from '../Types/Calendar'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export const calendarStoreConfig = (set, get) => ({
  providers: [] as Array<CalendarProviderType>,
  events: [] as Array<any>,
  tokens: {} as Record<string, string>,
  addToken: (service: string, token: string) =>
    set({
      tokens: {
        ...get().tokens,
        [service]: token
      }
    }),
  setEvents: (events: any[]) => set({ events }),
  setCalendarProviders: (providers: Array<CalendarProviderType>) => {
    set({ providers })
  },
  reset: () => {
    set({ prompts: {}, providers: [], results: {}, resultIndexes: {}, userPromptAuthInfo: undefined })
  }
})

export const useCalendarStore = createStore(calendarStoreConfig, StoreIdentifier.CALENDARS, true)
