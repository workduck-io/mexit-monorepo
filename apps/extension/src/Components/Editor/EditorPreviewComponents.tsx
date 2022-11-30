/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ELEMENT_ILINK,
  ELEMENT_LINK,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_PARAGRAPH,
  ELEMENT_TABLE,
  ELEMENT_TAG,
  ELEMENT_TODO_LI
} from '@mexit/core'
import { LinkElement,MediaEmbedElement, TableWrapper } from '@mexit/shared'
import { createPlateUI, withProps } from '@udecode/plate'
import { StyledElement } from '@udecode/plate-styled-components'

import TagElement from '../../Editor/components/Tags/TagElement'
import { QuickLinkElement } from '../../Editor/plugins/QuickLink/components/QuickLinkElement'
import Todo from './Todo'

export const editorPreviewComponents = {
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
  [ELEMENT_TAG]: TagElement,
  [ELEMENT_ILINK]: QuickLinkElement,
  [ELEMENT_MEDIA_EMBED]: MediaEmbedElement,
  [ELEMENT_TABLE]: TableWrapper,
  [ELEMENT_TODO_LI]: Todo
}

const components = createPlateUI({
  ...editorPreviewComponents
})

export default components
