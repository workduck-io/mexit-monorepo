/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createPlateUI,
  ELEMENT_LINK,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_PARAGRAPH,
  ELEMENT_TABLE,
  ELEMENT_TODO_LI,
  withProps
} from '@udecode/plate'
import { StyledElement } from '@udecode/plate-styled-components'

import Todo from '../../Components/Todo'
import TagElement from './Tags/TagElement'

import { LinkElement, MediaEmbedElement, TableWrapper } from '@mexit/shared'
import { ELEMENT_ILINK, ELEMENT_INLINE_BLOCK, ELEMENT_TAG } from '../elements'
import InlineBlock from './InlineBlock'
import QuickLinkElement from './QuickLink/QuickLinkElement'

export const editorPreviewComponents = createPlateUI({
  [ELEMENT_LINK]: withProps(LinkElement, {
    as: 'a'
  }),
  [ELEMENT_PARAGRAPH]: withProps(StyledElement, {
    styles: {
      root: {
        margin: '0.1rem 0 0'
      }
    }
  }),
  [ELEMENT_TODO_LI]: Todo as any,
  [ELEMENT_TAG]: TagElement as any,
  [ELEMENT_ILINK]: QuickLinkElement as any,
  [ELEMENT_INLINE_BLOCK]: QuickLinkElement as any,
  [ELEMENT_MEDIA_EMBED]: MediaEmbedElement as any,
  [ELEMENT_TABLE]: TableWrapper
})

const components = createPlateUI({
  ...editorPreviewComponents,
  [ELEMENT_INLINE_BLOCK]: InlineBlock as any
})

export default components
