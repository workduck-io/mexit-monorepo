import { RootClassName } from '@udecode/plate'
import { TElement } from '@udecode/plate-core'

// Data of Element node
export interface ILinkNodeData {
  value: string
  [key: string]: any
}

// Element node
export interface ILinkNode extends TElement {
  value: string
  [key: string]: any
}

export interface ILinkElementStyleProps extends RootClassName {
  selected?: boolean
  focused?: boolean
}
