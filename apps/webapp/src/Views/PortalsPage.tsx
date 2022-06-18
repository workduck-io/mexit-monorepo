import React, { useEffect, useMemo } from 'react'
import Section from '../Components/Portals/Section'
import { usePortals } from '../Hooks/usePortals'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import usePortalStore from '../Stores/usePortalStore'
import { Flex, FullHeight, IntegrationContainer } from '../Style/Integrations'
import { ActionGroupType } from '../Types/Actions'

const PortalsPage = () => {
  const { goTo } = useRouting()
  const apps = usePortalStore((store) => store.apps)
  const connectedPortals = usePortalStore((store) => store.connectedPortals)
  const getIsPortalConnected = usePortalStore((store) => store.getIsPortalConnected)

  const { getConnectedPortals, sortPortals } = usePortals()

  useEffect(() => {
    getConnectedPortals()
  }, []) // eslint-disable-line

  const onClick = (route: string, actionGroupId: string) => {
    goTo(route, NavigationType.push, actionGroupId)
  }

  const portals = useMemo(
    () => sortPortals(apps, (item: any) => !!getIsPortalConnected(item.actionGroupId)),
    [apps, connectedPortals] // eslint-disable-line
  )

  return (
    <Flex>
      <FullHeight>
        <IntegrationContainer>
          <Section
            items={portals}
            title="Portals"
            onClick={(item: ActionGroupType) => onClick(`${ROUTE_PATHS.integrations}/portal`, item.actionGroupId)}
          />
        </IntegrationContainer>
      </FullHeight>
    </Flex>
  )
}

export default PortalsPage
