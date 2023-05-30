import { API, API_BASE_URLS, useCalendarStore } from '@mexit/core'

const MAX_EVENTS = 15

export const useCalendar = () => {
  const setEvents = useCalendarStore((state) => state.setEvents)

  const getEvents = async (url: string) => {
    const token = useCalendarStore.getState().tokens.google

    const events = await API.calendar.getGoogleCalendarEvents(
      url,
      {
        enabled: false,
        expiry: 0
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    setEvents(events)
  }

  const getCalenderEvents = () => {
    const currentDate = new Date()
    const yesterday = new Date(currentDate.setDate(currentDate.getDate() - 1))
    const twoDaysFromNow = new Date(currentDate.setDate(currentDate.getDate() + 2))

    const request = encodeURI(
      `${API_BASE_URLS.googleCalendar}?maxResults=${MAX_EVENTS}&timeMin=${yesterday}&timeMax=${twoDaysFromNow}`
    )

    getEvents(request)
  }

  const getUpcomingEvents = () => {
    //
  }

  return {
    getUpcomingEvents,
    getCalenderEvents
  }
}
