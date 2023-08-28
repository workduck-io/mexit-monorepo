import { PlatePlugin } from '@udecode/plate-core'

import { SuperBlocks } from '@mexit/core'
import { ContentSuperBlock } from '@mexit/shared'

import { withSuperBlockElement } from './withSuperBlockElement'

/**
 * Enables support for Super Block - CONTENT.
 */
export const createContentSuperBlockPlugin = (): PlatePlugin => ({
  key: SuperBlocks.CONTENT,
  isElement: true,
  component: withSuperBlockElement(ContentSuperBlock),
  isInline: false,
  isVoid: false
})
