import React from 'react'

import Check from '@iconify-icons/ri/check-line'

import {
  ActiveStatus,
  CenteredFlex,
  DEFAULT_LIST_ITEM_ICON,
  getIconType,
  MexIcon,
  ProjectIconMex,
  RightCut,
  ServiceCard,
  ServiceName
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
      <ServiceName>{group?.name ?? ''}</ServiceName>
    </ServiceCard>
  )
}

export default ActionGroup
