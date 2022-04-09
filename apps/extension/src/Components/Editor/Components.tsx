/* eslint-disable @typescript-eslint/no-explicit-any */

import { createPlateUI, ELEMENT_LINK, ELEMENT_MEDIA_EMBED, ELEMENT_PARAGRAPH, withProps } from '@udecode/plate'
import { StyledElement } from '@udecode/plate-styled-components'
import LinkElement from './Link'
// import { MediaEmbedElement } from './media-embed-ui/src'
import { TagElement } from '@workduck-io/mex-editor'

export const ELEMENT_TAG = 'tag'

export const editorPreviewComponents = createPlateUI({
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
  [ELEMENT_TAG]: TagElement as any
  //   [ELEMENT_MEDIA_EMBED]: MediaEmbedElement as any
})

const components = createPlateUI({
  ...editorPreviewComponents
})

export default components
