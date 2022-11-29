import { Flex, FullHeight, IntegrationContainer } from '@mexit/shared'
import React, { useEffect, useMemo } from 'react'

import Section from '../Components/Portals/Section'
import { usePortals } from '../Hooks/usePortals'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import usePortalStore from '../Stores/usePortalStore'
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
            onClick={(item: ActionGroupType) =>
              goTo(`${ROUTE_PATHS.integrations}/portal`, NavigationType.push, item.actionGroupId)
            }
          />
        </IntegrationContainer>
      </FullHeight>
    </Flex>
  )
}

export default PortalsPage
