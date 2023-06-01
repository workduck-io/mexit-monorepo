import React, { useMemo, useState } from 'react'

import { formatDistanceToNow } from 'date-fns'

import { useCalendarStore, useHighlightStore } from '@mexit/core'
import {
  CenteredFlex,
  DefaultMIcons,
  FadeContainer,
  getMIcon,
  Group,
  IconDisplay,
  List,
  SnippetCards,
  Toggle,
  useCalendar,
  useInterval
} from '@mexit/shared'

import { AddTags } from './AddTags'
import { GenericCard } from './GenericCard'
import { HighlightGroups } from './HighlightGroup'
import { ShortenerComponent } from './ShortenerComponent'
import SidebarSection from './SidebarSection'
import { EventCard, EventHeading, Timestamp } from './styled'

// TODO: add links to onboarding tutorials later
// and maybe a check if the user doesn't want to see a card again
const basicOnboarding = [
  {
    icon: 'ri:link-m',
    title: 'Shorten URLs and Tag them',
    description: 'Create shortcuts for important URLs and tag them to organize'
  },
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

  return (
    <EventCard key={event.id} onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      <Group>
        <IconDisplay icon={DefaultMIcons.CALENDAR} />
        <EventHeading>{event.summary}</EventHeading>
      </Group>
      {showActions ? (
        <FadeContainer flex={false} fade>
          <Group>
            <IconDisplay icon={DefaultMIcons.NOTE} />
            <IconDisplay
              icon={DefaultMIcons.WEB_LINK}
              onClick={() => {
                window.open(event.links.meet, '_blank')
              }}
            />
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

  const { getUpcomingEvents, getCalenderEvents } = useCalendar()
  const calendarEvents = useCalendarStore((state) => state.events)

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

  // Every 5 mins fetch calendar events
  useInterval(fetchEvents, 30 * 60 * 1000)

  const upcomingEvents = useMemo(() => {
    return getUpcomingEvents()
  }, [calendarEvents])

  return (
    <SidebarSection label="Upcoming Events" isLoading={isFetching} icon={DefaultMIcons.NOTIFICATION}>
      <List $noMargin scrollable $maxHeight="8vh">
        {upcomingEvents.map((event) => {
          const desc = event.description ? `: ${event.description}` : ''

          return <CalendarEvent event={event} />
        })}
      </List>
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
      rightComponent={<Toggle size="small" onChange={setShowAll} text="All" />}
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
      <SidebarSection label="Shorten URL" icon={getMIcon('ICON', 'ri:link-m')}>
        <ShortenerComponent />
      </SidebarSection>
      <SidebarSection label="Tags" icon={DefaultMIcons.TAG}>
        <AddTags />
      </SidebarSection>
      <UpcomingEvents />
      <Highlights />
    </SnippetCards>
  )
}
