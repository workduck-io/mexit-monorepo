import { PlatePlugin } from '@udecode/plate-core'

import { ELEMENT_TASK_VIEW_BLOCK } from '@mexit/core'

import { getViewBlockDeserializer } from '../Components/ViewBlock/getViewBlockDeserializer'

export const createViewBlockPlugin = (): PlatePlugin => ({
  isElement: true,
  deserializeHtml: getViewBlockDeserializer(),
  isVoid: true,
  key: ELEMENT_TASK_VIEW_BLOCK
})
