import { CalendarProviderType, StoreIdentifier } from '../Types'
import { getLocalStorage } from '../Utils'
import { createStore } from '../Utils/storeCreator'

const getInitCalendarStore = () => ({
  providers: [] as Array<CalendarProviderType>,
  events: [] as Array<any>,
  tokens: {} as Record<string, string>
})

export const calendarStoreConfig = (set, get) => ({
  ...getInitCalendarStore(),
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
    const initState = getInitCalendarStore()
    set(initState)
  }
})

export const useCalendarStore = createStore(calendarStoreConfig, StoreIdentifier.CALENDARS, true, {
  storage: {
    web: getLocalStorage()
  }
})
