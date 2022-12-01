import { ELEMENT_TASK_VIEW_LINK } from '@mexit/core'

import { getTaskViewLinkDeserializer } from '../Components/TaskViewLink/getTaskViewLinkDeserializer'
import { PlatePlugin } from '@udecode/plate-core'

export const createTaskViewLinkPlugin = (): PlatePlugin => ({
  isElement: true,
  deserializeHtml: getTaskViewLinkDeserializer(),
  isInline: true,
  isVoid: true,
  key: ELEMENT_TASK_VIEW_LINK
})
