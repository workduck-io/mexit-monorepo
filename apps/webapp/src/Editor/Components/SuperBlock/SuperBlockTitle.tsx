import React from 'react'

import { MIcon } from '@mexit/core'
import { Group, IconDisplay } from '@mexit/shared'

import { PropertiyFields } from './SuperBlock.types'

interface SuperBlockTitleInfoProps {
  name?: string
  heading: string
  value: PropertiyFields
  icon: MIcon
  onChange?: (properties: Partial<PropertiyFields>) => void
}

const SuperBlockTitle: React.FC<SuperBlockTitleInfoProps> = ({ icon, heading, name = 'title', value }) => {
  const title = value?.[name]

  return (
    <Group>
      <IconDisplay icon={icon} size={14} />
      <Group>
        <span>{heading}</span>
        <span>|</span>
        <span>{title?.trim() ? title : 'Untitled'}</span>
      </Group>
    </Group>
  )
}

export default SuperBlockTitle
