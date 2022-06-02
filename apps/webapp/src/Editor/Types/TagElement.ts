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
export type TagNode = TElement<TagNodeData>

export interface TagElementStyleProps extends ClassName {
  selected?: boolean
  focused?: boolean
}

export interface TagElementStyleSet extends RootStyled {
  link?: IStyle
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TagElementProps = StyledElementProps<TagNode, TagElementStyleProps, TagElementStyleSet>
