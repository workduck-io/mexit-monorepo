import { RootClassName, RootStyles, StyledElementProps } from '@udecode/plate'
import { IStyle } from '@uifabric/styling'

import { TElement } from '@udecode/plate-core'

// Data of Element node
export interface ILinkNodeData {
  value: string
  [key: string]: any
}

// Element node
export type ILinkNode = TElement<ILinkNodeData>

export interface ILinkElementStyleProps extends RootClassName {
  selected?: boolean
  focused?: boolean
}

export interface ILinkElementStyleSet extends RootStyles {
  link?: IStyle
}

// eslint-disable-next-line
//@ts-ignore
export type ILinkElementProps = StyledElementProps<ILinkNode, ILinkElementStyleProps, ILinkElementStyleSet>

export type ILinkProps = ILinkElementProps & {
  nodeid: string
  onClick: any
  isArchived: boolean
  showPreview: boolean
  archivedIcon: string
}
