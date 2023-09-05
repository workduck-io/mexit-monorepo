import { PlatePlugin } from '@udecode/plate-core'

import { SuperBlocks } from '@mexit/core'

import { ContentSuperBlock, MeetSuperBlock } from '../../SuperBlock'
import { AISuperBlock } from '../../SuperBlock/AISuperBlock'

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

/**
 * Enables support for Super Block - CONTENT.
 */
export const createMeetSuperBlockPlugin = (): PlatePlugin => ({
  key: SuperBlocks.MEET,
  isElement: true,
  component: withSuperBlockElement(MeetSuperBlock),
  isInline: false,
  isVoid: false
})

/**
 * Enables support for Super Block - CONTENT.
 */
export const createAISuperBlockPlugin = (): PlatePlugin => ({
  key: SuperBlocks.AI,
  isElement: true,
  component: withSuperBlockElement(AISuperBlock),
  isInline: false,
  isVoid: false
})
