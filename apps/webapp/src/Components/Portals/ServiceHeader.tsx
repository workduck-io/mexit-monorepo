import React from 'react'

import { Button, Title } from '@mexit/shared'

import { DEFAULT_LIST_ITEM_ICON, getIconType, ProjectIconMex } from './utils'
import { FlexBetween } from '../FloatingButton'
import { ActionGroupIcon, ServiceDescription, GroupHeader } from './styled'

type ServiceHeaderProps = {
  icon: string
  onClick: () => void
  isConnected: boolean
  title: string
  description: string
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({ icon, onClick, isConnected, title, description }) => {
  const { mexIcon } = getIconType(icon || DEFAULT_LIST_ITEM_ICON)

  return (
    <div>
      <ActionGroupIcon>
        <span>
          <ProjectIconMex isMex={mexIcon} icon={icon} size={140} />
        </span>
        <Button onClick={onClick} disabled={isConnected}>
          {isConnected ? 'Disconnect' : 'Connect'}
        </Button>
      </ActionGroupIcon>
      <GroupHeader connected={isConnected}>
        <FlexBetween>
          <Title>{title}</Title>
        </FlexBetween>
        <ServiceDescription>
          {description ??
            `Magna quis cupidatat laboris aliquip esse. Ut Despacito eu voluptate qui incididunt ipsum. Officia et esse
              enim laborum ullamco magna labore quis sit mollit. Esse amet nostrud pariatur esse. Commodo consequat
              ipsum tempor ad cillum ad et esse nostrud veniam pariatur excepteur laboris. Adipisicing aliqua do
              proident aliquip ad et voluptate et ut excepteur mollit do tempor. Magna nostrud esse sunt anim quis in.
              Amet ut fugiat adipisicing officia aliquip quis non. Veniam magna dolor consequat quis aliqua ea ipsum
              reprehenderit commodo commodo. Minim minim sit sit magna labore sint esse ipsum.`}
        </ServiceDescription>
      </GroupHeader>
    </div>
  )
}

export default ServiceHeader
