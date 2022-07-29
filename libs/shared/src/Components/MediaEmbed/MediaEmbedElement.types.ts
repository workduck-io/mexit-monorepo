import { TMediaEmbedElement, Value } from '@udecode/plate'
import { StyledElementProps } from '@udecode/plate-styled-components'
import { CSSProp } from 'styled-components'

export interface MediaEmbedElementStyles {
  iframeWrapper: CSSProp
  iframe: CSSProp
  input: CSSProp
}

export type MediaEmbedElementProps = StyledElementProps<Value, TMediaEmbedElement, MediaEmbedElementStyles>
