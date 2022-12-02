import { RootClassName, RootStyles } from '@udecode/plate'
import { TElement } from '@udecode/plate-core'
import { IStyle } from '@uifabric/styling'

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

export interface ILinkElementStyleSet extends RootStyles {
  link?: IStyle
}

// eslint-disable-next-line
//@ts-ignore
export type ILinkElementProps = StyledElementProps<Value, ILinkNode, ILinkElementStyleSet>

export type ILinkProps = ILinkElementProps & {
  nodeid: string
  onClick: any
  isArchived: boolean
  showPreview: boolean
  archivedIcon: string
}
