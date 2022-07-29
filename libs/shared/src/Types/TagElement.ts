// eslint-disable-next-line
// @ts-nocheck
import { ClassName, RootStyled, StyledElementProps } from '@udecode/plate'
import { TElement } from '@udecode/plate-core'
import { IStyle } from '@uifabric/styling'

// Data of Element node
export interface TagNodeData {
  value: string
  [key: string]: any
}

// Element node
export interface TagNode extends TElement, TagNodeData {}

export interface TagElementStyleProps extends ClassName {
  selected?: boolean
  focused?: boolean
}

export interface TagElementStyleSet extends RootStyled {
  link?: IStyle
}

export type TagElementProps = StyledElementProps<Value, TagNode, TagElementStyleSet>
