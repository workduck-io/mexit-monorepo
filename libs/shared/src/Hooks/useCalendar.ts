import { add, sub } from 'date-fns'

import { API, API_BASE_URLS, useCalendarStore } from '@mexit/core'

const MAX_EVENTS = 15

export const useCalendar = () => {
  const setEvents = useCalendarStore((state) => state.setEvents)
  const addToken = useCalendarStore((state) => state.addToken)

  const _refreshTokenHook = async (request, _, response) => {
    if (response && response.status === 401) {
      try {
        const res = await API.calendar.getGoogleCalendarNewToken()
        addToken('GOOGLE_CAL', res.accessToken)
      } catch (error) {
        throw new Error(error)
      }
    }

    return
  }

  const getEvents = async (url: string) => {
    const result = await chrome.runtime.sendMessage({
      type: 'CALENDAR',
      subType: 'GET_EVENTS',
      data: {
        url
      }
    })

    if (result.message) {
      const events = result.message.items
      setEvents(events.map(converGoogleEventToCalendarEvent))
    }
  }

  const converGoogleEventToCalendarEvent = (event: any) => {
    const createdTime = Date.parse(event.created)
    const updatedTime = Date.parse(event.updated)
    const startTime = Date.parse(event.start.dateTime ?? event.start.date)
    const endTime = Date.parse(event.end.dateTime ?? event.end.date)
    const people =
      event.attendees !== undefined
        ? event.attendees.map((a) => {
            const person: any = {
              email: a.email,
              displayName: a.displayName,
              optional: a.optional,
              organizer: a.email === event.organizer?.email,
              responseStatus: a.responseStatus as any,
              creator: a.email === event.creator?.email,
              resource: a.resource
            }

            return person
          })
        : []

    return {
      id: event.id,
      status: event.status as any,
      summary: event.summary,
      description: event.description,
      links: {
        meet: event.hangoutLink,
        event: event.htmlLink
      },
      creator: event.creator,
      times: {
        created: createdTime,
        updated: updatedTime,
        start: startTime,
        end: endTime
      },
      people
    }
  }

  const getCalenderEvents = async () => {
    const currentDate = new Date()
    const yesterday = sub(currentDate, { days: 1 }).toISOString()
    const twoDaysFromNow = add(currentDate, { days: 2 }).toISOString()

    const request = encodeURI(
      `${API_BASE_URLS.googleCalendar}?maxResults=${MAX_EVENTS}&timeMin=${yesterday}&timeMax=${twoDaysFromNow}`
    )

    await getEvents(request)
  }

  const getUpcomingEvents = () => {
    const now = new Date()
    const twoHoursFromNow = add(now, { hours: 2 })
    const events = useCalendarStore.getState().events
    const todayEvents = events
      .filter((event) => {
        const start = new Date(event.times.start)
        return start <= twoHoursFromNow
      })
      .sort((a, b) => a.times.start - b.times.start)

    return todayEvents
  }

  return {
    getUpcomingEvents,
    getCalenderEvents
  }
}
