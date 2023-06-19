import { PlatePlugin } from '@udecode/plate-core'

import { ELEMENT_GROUP } from '@mexit/core'

export const createSectionSeparatorPlugin = (): PlatePlugin => ({
  isElement: true,
  isVoid: true,
  isInline: false,
  key: ELEMENT_GROUP
})
