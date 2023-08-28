import React, { ReactElement } from 'react'

import { StyledElementProps, TElement, Value } from '@udecode/plate'

import { MIcon, SuperBlocks } from '@mexit/core'

export interface MetadataFields {
  createdAt: number
  updatedAt: number

  createdBy: string
  updatedBy: string
}

interface BlockEntityHistory {
  active: SuperBlocks
  values?: Record<
    SuperBlocks,
    {
      id: string
      parent?: string
    }
  >
}

export interface PropertiyFields {
  tags: Array<{
    value: string
    count: number
  }>

  assignee?: {
    value: string
    count: number
  }

  // Generated internally by Super Block
  title: string
  icon: MIcon

  entity: BlockEntityHistory

  // Stores Values of Components rendered using config
  template?: Record<string, any>

  [key: string]: any
}

export interface ISuperBlock extends TElement {
  id: string
  type: SuperBlocks
  metadata?: MetadataFields
  properties?: PropertiyFields
}

export interface SuperBlockProps {
  id?: string
  parent?: string
  type?: SuperBlocks

  as?: string
  style?: React.CSSProperties
  className?: string
  children?: any

  value: PropertiyFields
  metadata: MetadataFields

  isActive: boolean
  isSelected: boolean
  isReadOnly?: boolean

  FooterRightComponent?: ReactElement

  onChange?: (propertiesToUpdate: Partial<PropertiyFields>) => void
}

export type SuperBlockElementProps<V extends Value> = Partial<StyledElementProps<V, ISuperBlock>>
