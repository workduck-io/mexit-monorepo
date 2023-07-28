import { PlatePlugin } from '@udecode/plate-core'

import { SuperBlocks } from '@mexit/core'

import SmartCaptureSuperBlock from '../Components/SuperBlock/SmartCaptureSuperBlock'
import { withSuperBlockElement } from '../Components/SuperBlock/withSuperBlockElement'

/**
 * Enables support for Super Block - Smart Capture.
 */
export const createSmartCaptureSuperBlockPlugin = (): PlatePlugin => ({
  key: SuperBlocks.CAPTURE,
  isElement: true,
  component: withSuperBlockElement(SmartCaptureSuperBlock),
  isInline: false,
  isVoid: false
})
