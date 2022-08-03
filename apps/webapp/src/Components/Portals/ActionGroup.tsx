import React from 'react'

import Check from '@iconify-icons/ri/check-line'

import { camelCase } from '@mexit/core'
import {
  MexIcon,
  ActiveStatus,
  CenteredFlex,
  RightCut,
  ServiceCard,
  ServiceName,
  DEFAULT_LIST_ITEM_ICON,
  getIconType,
  ProjectIconMex
} from '@mexit/shared'

import { ActionGroupType } from '../../Types/Actions'

type ActionGroupProps = {
  group: Partial<ActionGroupType>
  onClick: () => void
}

const ActionGroup: React.FC<ActionGroupProps> = ({ group, onClick }) => {
  const { mexIcon } = getIconType(group.icon || DEFAULT_LIST_ITEM_ICON)

  return (
    <ServiceCard data-tour="service-connect" onClick={onClick} hover={!group?.connected}>
      {group?.connected && (
        <>
          <RightCut />
          <ActiveStatus>
            <MexIcon $noHover height={24} icon={Check} />
          </ActiveStatus>
        </>
      )}
      <CenteredFlex>
        <ProjectIconMex isMex={mexIcon} icon={group.icon} size={56} />
      </CenteredFlex>
      <ServiceName>{camelCase(group.actionGroupId)}</ServiceName>
    </ServiceCard>
  )
}

export default ActionGroup
