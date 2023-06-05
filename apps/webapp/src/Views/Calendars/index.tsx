import React from 'react'
import { useParams } from 'react-router-dom'

import { useCalendarStore } from '@mexit/core'

import ServiceHeader from '../../Components/Portals/ServiceHeader'
import ServiceInfo from '../../Components/Portals/ServiceInfo'

const CalendarService = () => {
  const params = useParams()

  const providers = useCalendarStore((store) => store.providers)
  const tokens = useCalendarStore((store) => store.tokens)
  const actionGroup = providers.find((provider) => provider.actionGroupId === params.actionGroupId)

  const onClick = () => {
    const url = actionGroup?.authConfig?.authURL

    if (url) window.open(url, '_blank')
  }

  return (
    <ServiceInfo>
      <ServiceHeader
        description={actionGroup?.description}
        icon={actionGroup?.icon}
        isConnected={!!tokens[actionGroup?.actionGroupId]}
        title={actionGroup?.name}
        onClick={onClick}
      />
    </ServiceInfo>
  )
}

export default CalendarService
