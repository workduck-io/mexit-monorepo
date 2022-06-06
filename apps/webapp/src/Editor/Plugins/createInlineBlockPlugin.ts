import { PlatePlugin } from '@udecode/plate-core'
import { getInlineBlockDeserializer } from '../Components/InlineBlock/getInlineBlockDeserializer'
import { ELEMENT_INLINE_BLOCK } from '@mexit/core'

export const createInlineBlockPlugin = (): PlatePlugin => ({
  isElement: true,
  deserializeHtml: getInlineBlockDeserializer(),
  isVoid: true,
  key: ELEMENT_INLINE_BLOCK
})
