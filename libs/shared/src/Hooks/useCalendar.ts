import { add, format, sub } from 'date-fns'

import {
  API_BASE_URLS,
  generateNodeId,
  getSlug,
  MEETING_PREFIX,
  MeetingSnippetContent,
  SEPARATOR,
  useCalendarStore,
  useDataStore
} from '@mexit/core'

const MAX_EVENTS = 15

export const useCalendar = () => {
  const setEvents = useCalendarStore((state) => state.setEvents)
  const addToken = useCalendarStore((state) => state.addToken)

  const getNodeForMeeting = async (e: any, onCreate): Promise<string | undefined> => {
    const title = `${getSlug(e.summary)} ${format(e.times.start, 'dd-MM-yyyy')}`
    const meetNotePath = `${MEETING_PREFIX}${SEPARATOR}${title}`
    const links = useDataStore.getState().ilinks

    const link = links?.find((l) => l.path === meetNotePath)
    if (link) return link.nodeid

    const node = await onCreate({
      node: {
        nodeid: generateNodeId(),
        title,
        path: meetNotePath
      },
      content: MeetingSnippetContent({
        title: e.summary,
        date: e.times.start,
        link: e.links.meet ?? e.links.event
        // attendees: getAttendeeUserIDsFromCalendarEvent(e)
      })
    })

    if (node) return node.nodeId
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
        console.log('START', { start, event, twoHoursFromNow, isStart: start <= twoHoursFromNow })
        return start <= twoHoursFromNow && start >= now
      })
      .sort((a, b) => b.times.start - a.times.start)

    return todayEvents
  }

  const getCalendarAuth = async () => {
    const res = await chrome.runtime.sendMessage({ type: 'CALENDAR', subType: 'GET_AUTH' })

    if (!res?.error) {
      addToken('GOOGLE_CAL', res?.message)
    }
  }

  return {
    getCalendarAuth,
    getNodeForMeeting,
    getUpcomingEvents,
    getCalenderEvents
  }
}
