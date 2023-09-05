import React, { useEffect, useMemo, useState } from 'react'

import { formatDistanceToNow } from 'date-fns'

import {
  API_BASE_URLS,
  CalendarEventFilterType,
  DrawerType,
  getMenuItem,
  MenuListItemType,
  useCalendarStore,
  useHighlightStore,
  useLayoutStore
} from '@mexit/core'
import {
  CenteredFlex,
  DefaultMIcons,
  FadeContainer,
  FadeText,
  getMIcon,
  Group,
  IconDisplay,
  List,
  Select,
  SidebarListFilter,
  SnippetCards,
  SpaceBetweenHorizontalFlex,
  StyledButton,
  useCalendar,
  useInterval
} from '@mexit/shared'

import { useSaveChanges } from '../../Hooks/useSaveChanges'
import { getElementById } from '../../Utils/cs-utils'
import ContactSmartCaptureSection from '../ContactSection'

import { GenericCard } from './GenericCard'
import { HighlightGroups } from './HighlightGroup'
import SidebarSection from './SidebarSection'
import { EventCard, EventHeading, Timestamp } from './styled'

// TODO: add links to onboarding tutorials later
// and maybe a check if the user doesn't want to see a card again
const basicOnboarding = [
  // {
  //   icon: 'ri:link-m',
  //   title: 'Shorten URLs and Tag them',
  //   description: 'Create shortcuts for important URLs and tag them to organize'
  // },
  {
    icon: 'ri:edit-2-line',
    title: 'Highlight Content',
    description:
      'Select and open Spotlight to create a highlight and save it in a note. Highlights are shown here in the sidebar'
  },
  {
    icon: 'lucide:highlighter',
    title: 'Use your knowledge everywhere',
    description: 'Use [[ to link to your public notes, use snippets and insert website shortcuts that you have created'
  }
]

const CalendarEvent = ({ event }) => {
  const [showActions, setShowActions] = useState(false)
  const openDrawer = useLayoutStore((store) => store.setDrawer)

  const { getNodeForMeeting } = useCalendar()
  const { saveNode } = useSaveChanges()

  const openMeetingNote = async () => {
    try {
      openDrawer({
        type: DrawerType.LOADING,
        data: {
          isLoading: true,
          title: 'Creating Meeting Note'
        }
      })
      const nodeId = await getNodeForMeeting(event, saveNode)

      if (nodeId) {
        openMeetLink(`${API_BASE_URLS.frontend}/editor/${nodeId}`)
      }
    } catch (err) {
      console.error('Unable To Create Meeting Note', err)
    } finally {
      openDrawer(null)
    }
  }

  const openMeetLink = (url?: string) => {
    const webLink = url ?? event.links.meet ?? event.links.event

    window.open(webLink, '_blank')
  }

  return (
    <EventCard key={event.id} onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      <Group>
        <IconDisplay icon={DefaultMIcons.CALENDAR} />
        <EventHeading>{event.summary}</EventHeading>
      </Group>
      {showActions ? (
        <FadeContainer flex={false} fade>
          <Group>
            <IconDisplay icon={DefaultMIcons.NOTE} onClick={openMeetingNote} />
            <IconDisplay icon={DefaultMIcons.WEB_LINK} onClick={() => openMeetLink()} />
          </Group>
        </FadeContainer>
      ) : (
        <FadeContainer flex={false} fade>
          <Timestamp>{formatDistanceToNow(event.times.start)}</Timestamp>
        </FadeContainer>
      )}
    </EventCard>
  )
}

const UpcomingEvents = () => {
  const [isFetching, setIsFetching] = useState(false)

  const { getUpcomingEvents, getCalenderEvents, getCalendarAuth } = useCalendar()
  const [calendarEventFilter, setCalendarEventFilter] = useState<CalendarEventFilterType>('Upcoming')
  const calendarEvents = useCalendarStore((state) => state.events)
  const calendarToken = useCalendarStore((store) => store.tokens['GOOGLE_CAL'])

  const fetchEvents = async () => {
    setIsFetching(true)
    try {
      await getCalenderEvents()
    } catch (err) {
      console.error('Unable to fetch google events', err)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    getCalendarAuth()
  }, [])

  const onCalendarConnect = () => {
    // TODO: Add redirect from new window on login if `extension` flag is present
    // using window.opener in web app
    window.open(`${API_BASE_URLS.frontend}/integrations/calendars/GOOGLE_CAL`)
  }

  useEffect(() => {
    if (calendarToken) {
      fetchEvents()
    }
  }, [calendarToken])

  // Every 5 mins fetch calendar events
  useInterval(fetchEvents, 30 * 60 * 1000)

  const upcomingEvents = useMemo(() => {
    return getUpcomingEvents(calendarEventFilter)
  }, [calendarEvents, calendarEventFilter])

  const hasUpcomingEvents = upcomingEvents?.length > 0

  const onClick = (event: MenuListItemType) => {
    setCalendarEventFilter(event.label as CalendarEventFilterType)
  }

  return (
    <SidebarSection
      label="Events"
      isLoading={isFetching}
      icon={DefaultMIcons.NOTIFICATION}
      rightComponent={
        <Select
          root={getElementById('ext-side-nav')}
          items={[
            getMenuItem('Upcoming', onClick, false),
            getMenuItem('Past', onClick, false),
            getMenuItem('All', onClick, false)
          ]}
        />
      }
    >
      {calendarToken && hasUpcomingEvents ? (
        <List $noMargin scrollable $maxHeight="140px">
          {upcomingEvents.map((event) => {
            return <CalendarEvent event={event} />
          })}
        </List>
      ) : (
        <SidebarListFilter noMargin>
          <SpaceBetweenHorizontalFlex width>
            <Group>
              <IconDisplay icon={getMIcon('ICON', 'logos:google-calendar')} />
              <FadeText>
                {calendarToken && !hasUpcomingEvents
                  ? 'There are no upcoming events'
                  : 'Connect Calendar to get updates'}
              </FadeText>
            </Group>
            {!calendarToken && <StyledButton onClick={onCalendarConnect}>Connect</StyledButton>}
          </SpaceBetweenHorizontalFlex>
        </SidebarListFilter>
      )}
    </SidebarSection>
  )
}

const Highlights = () => {
  const [showAll, setShowAll] = useState(false)

  const highlights = useHighlightStore((state) => state.highlights)
  const getHighlightsOfUrl = useHighlightStore((state) => state.getHighlightsOfUrl)

  const pageHighlights = useMemo(() => {
    const list = showAll ? highlights : getHighlightsOfUrl(window.location.href)

    return list?.sort((a, b) => {
      if (a?.createdAt && b?.createdAt) {
        return a.createdAt - b.createdAt
      }

      return 0
    })
  }, [window.location, highlights, showAll])

  return (
    <SidebarSection
      scrollable
      label="Captures"
      icon={DefaultMIcons.HIGHLIGHT}
      rightComponent={
        <Select
          root={getElementById('ext-side-nav')}
          items={[
            getMenuItem('Page', () => setShowAll(false), false),
            getMenuItem('All', () => setShowAll(true), false)
          ]}
        />
      }
    >
      {pageHighlights?.length > 0 ? (
        <List $noMargin scrollable>
          <HighlightGroups highlights={pageHighlights} all={showAll} />
        </List>
      ) : (
        <>
          <CenteredFlex>
            <h2>Hi there</h2>
            <p>Let&apos;s get you started</p>
          </CenteredFlex>
          <SnippetCards fullHeight={false}>
            {basicOnboarding.map((item) => (
              <GenericCard icon={item.icon} title={item.title} description={item.description} />
            ))}
          </SnippetCards>
        </>
      )}
    </SidebarSection>
  )

  return <></>
}

export function ContextInfoBar() {
  return (
    <SnippetCards fullHeight>
      <ContactSmartCaptureSection />
      <UpcomingEvents />
      {/* <Highlights /> */}
    </SnippetCards>
  )
}
