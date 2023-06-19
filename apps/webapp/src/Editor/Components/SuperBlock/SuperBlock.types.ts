import { StyledElementProps, TElement, Value } from '@udecode/plate'

import { SuperBlocks } from '@mexit/core'

export interface ISuperBlock extends TElement {
  id: string
  type: SuperBlocks
  children: TElement[]
  metadata: Record<string, any>
}

export type SuperBlockProps<V extends Value> = StyledElementProps<V, ISuperBlock>
