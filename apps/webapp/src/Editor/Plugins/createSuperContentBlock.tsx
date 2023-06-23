import { PlatePlugin } from '@udecode/plate-core'

import { SuperBlocks } from '@mexit/core'

import ContentSuperBlock from '../Components/SuperBlock/ContentSuperBlock'

/**
 * Enables support for Super Block - Task.
 */
export const createContentSuperBlockPlugin = (): PlatePlugin => ({
  key: SuperBlocks.CONTENT,
  isElement: true,
  component: ContentSuperBlock,
  isInline: false,
  isVoid: false
})
