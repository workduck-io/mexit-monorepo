import { StyledElementProps, TElement, Value } from '@udecode/plate'

import { SuperBlocks } from '@mexit/core'

export interface MetadataFields {
  createdAt: string
  updatedAt: string

  createdBy: string
  updatedBy: string

  properties: Record<string, unknown>
}

export interface ISuperBlock extends TElement {
  id: string
  type: SuperBlocks
  metadata: MetadataFields
}

export type SuperBlockProps<V extends Value> = StyledElementProps<V, ISuperBlock>
