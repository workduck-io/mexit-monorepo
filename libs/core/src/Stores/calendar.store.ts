import { CalendarStoreType } from '../Types/Calendar'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export const calendarStoreConfig = (set, get): CalendarStoreType => ({
  providers: [],
  setCalendarProviders: (providers) => {
    set({ providers })
  },
  reset: () => {
    set({ prompts: {}, providers: [], results: {}, resultIndexes: {}, userPromptAuthInfo: undefined })
  }
})

export const useCalendarStore = createStore(calendarStoreConfig, StoreIdentifier.CALENDARS, true)
