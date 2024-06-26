import React, { useEffect, useMemo } from 'react'

import { CalendarProviderType, PromptProviderType, useCalendarStore, usePortalStore, usePromptStore } from '@mexit/core'
import { Flex, FullHeight, IntegrationContainer } from '@mexit/shared'

import Section from '../Components/Portals/Section'
import { useCalendarAPI } from '../Hooks/API/useCalendarAPI'
import { usePortals } from '../Hooks/usePortals'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { ActionGroupType } from '../Types/Actions'

const PortalsPage = () => {
  const { goTo } = useRouting()
  const apps = usePortalStore((store) => store.apps)
  const connectedPortals = usePortalStore((store) => store.connectedPortals)
  const promptsProviders = usePromptStore((store) => store.providers)
  const calendarTokens = useCalendarStore((store) => store.tokens)
  const calendarProviders = useCalendarStore((store) => store.providers)
  const getIsPortalConnected = usePortalStore((store) => store.getIsPortalConnected)

  const { getConnectedPortals, sortPortals } = usePortals()
  const { getGoogleCalendarAuth } = useCalendarAPI()

  useEffect(() => {
    Promise.allSettled([getConnectedPortals(), getGoogleCalendarAuth()])
  }, []) // eslint-disable-line

  const portals = useMemo(
    () => sortPortals(apps, (item: any) => !!getIsPortalConnected(item.actionGroupId)),
    [apps, connectedPortals] // eslint-disable-line
  )

  const calendars = useMemo(() => {
    return calendarProviders.map((provider) => {
      return {
        ...provider,
        connected: calendarTokens?.[provider.actionGroupId]
      }
    })
  }, [calendarProviders, calendarTokens])

  return (
    <Flex>
      <FullHeight>
        <IntegrationContainer>
          <Section
            items={calendars}
            title="Calendars"
            onClick={(item: CalendarProviderType) =>
              goTo(`${ROUTE_PATHS.integrations}/calendars`, NavigationType.push, item.actionGroupId)
            }
          />
          <Section
            items={portals}
            title="Portals"
            onClick={(item: ActionGroupType) =>
              goTo(`${ROUTE_PATHS.integrations}/portal`, NavigationType.push, item.actionGroupId)
            }
          />
          <Section
            items={promptsProviders}
            title="Prompts"
            onClick={(item: PromptProviderType) =>
              goTo(`${ROUTE_PATHS.integrations}/prompts`, NavigationType.push, item.actionGroupId)
            }
          />
        </IntegrationContainer>
      </FullHeight>
    </Flex>
  )
}

export default PortalsPage
