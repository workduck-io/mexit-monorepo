//@ts-nocheck
import { ClassName, RootStyled, StyledElementProps } from '@udecode/plate';
import { IStyle } from '@uifabric/styling';
import { TagNode } from '../types';

export interface TagElementStyleProps extends ClassName {
  selected?: boolean;
  focused?: boolean;
}

export interface TagElementStyleSet extends RootStyled {
  link?: IStyle;
}
export type TagElementProps = StyledElementProps<
  TagNode,
  TagElementStyleProps,
  TagElementStyleSet
>;
