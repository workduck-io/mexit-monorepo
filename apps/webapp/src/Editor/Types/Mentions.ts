// eslint-disable-next-line
// @ts-ignore
import { ClassName, RootStyled, StyledElementProps, TElement } from '@udecode/plate'
import { IStyle } from '@uifabric/styling'

// Data of Element node
export interface MentionNodeData {
  value: string
  [key: string]: any
}

// Element node
export type MentionNode = TElement<MentionNodeData>

export interface MentionElementStyleProps extends ClassName {
  selected?: boolean
  focused?: boolean
}

export interface MentionElementStyleSet extends RootStyled {
  link?: IStyle
}

// eslint-disable-next-line
// @ts-ignore
export type MentionElementProps = StyledElementProps<MentionNode, MentionElementStyleProps, MentionElementStyleSet>
