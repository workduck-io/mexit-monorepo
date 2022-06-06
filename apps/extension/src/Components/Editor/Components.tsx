/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createPlateUI,
  ELEMENT_LINK,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_PARAGRAPH,
  ELEMENT_TABLE,
  withProps
} from '@udecode/plate'
import { StyledElement } from '@udecode/plate-styled-components'
import { MediaEmbedElement, TableWrapper, LinkElement } from '@mexit/shared'
import { ELEMENT_ILINK } from '../../Editor/types'
import TagElement from '../../Editor/components/Tags/TagElement'
import QuickLinkElement from '../../Editor/plugins/QuickLink/components/QuickLinkElement'

export const ELEMENT_TAG = 'tag'

export const components = {
  [ELEMENT_LINK]: withProps(LinkElement, {
    as: 'a'
  }),
  [ELEMENT_PARAGRAPH]: withProps(StyledElement, {
    styles: {
      root: {
        margin: '0.1em 0 0'
      }
    }
  }),
  [ELEMENT_TAG]: TagElement,
  [ELEMENT_ILINK]: QuickLinkElement,
  [ELEMENT_MEDIA_EMBED]: MediaEmbedElement,
  [ELEMENT_TABLE]: TableWrapper
}

// const components = createPlateUI({
//   ...editorPreviewComponents
// })

export default components
