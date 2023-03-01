import { PlatePlugin } from '@udecode/plate-core'

import { ELEMENT_SECTION_SEPARATOR } from '@mexit/core'

export const createSectionSeparatorPlugin = (): PlatePlugin => ({
  isElement: true,
  isVoid: true,
  isInline: false,
  key: ELEMENT_SECTION_SEPARATOR
})
