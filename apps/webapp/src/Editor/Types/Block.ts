import { TElement, Value } from '@udecode/plate'
import { StyledElementProps } from '@udecode/plate-styled-components'

export interface BlockIdType extends TElement {
  id?: string
}

export type BlockOptionProps = StyledElementProps<Value, BlockIdType>
