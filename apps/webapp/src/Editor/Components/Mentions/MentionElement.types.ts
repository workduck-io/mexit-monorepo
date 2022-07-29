//@ts-nocheck
import { ClassName, RootStyled, StyledElementProps, Value } from '@udecode/plate'
import { IStyle } from '@uifabric/styling'
import { MentionNode } from '../types'

export interface MentionElementStyleProps extends ClassName {
  selected?: boolean
  focused?: boolean
}

export interface MentionElementStyleSet extends RootStyled {
  link?: IStyle
}
export type MentionElementProps = StyledElementProps<Value, MentionNode, MentionElementStyleSet>
