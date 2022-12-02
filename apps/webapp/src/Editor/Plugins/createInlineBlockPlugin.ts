import { PlatePlugin } from '@udecode/plate-core'

import { ELEMENT_INLINE_BLOCK } from '@mexit/core'

import { getInlineBlockDeserializer } from '../Components/InlineBlock/getInlineBlockDeserializer'

export const createInlineBlockPlugin = (): PlatePlugin => ({
  isElement: true,
  deserializeHtml: getInlineBlockDeserializer(),
  isVoid: true,
  key: ELEMENT_INLINE_BLOCK
})
