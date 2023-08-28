import { PlatePlugin } from '@udecode/plate-core'

import { SuperBlocks } from '@mexit/core'
import { TaskSuperBlock } from '@mexit/shared'

import { withSuperBlockElement } from './withSuperBlockElement'

/**
 * Enables support for Super Block - Task.
 */
export const createTaskSuperBlockPlugin = (): PlatePlugin => ({
  key: SuperBlocks.TASK,
  isElement: true,
  deserializeHtml: {
    getNode: (el: HTMLElement, node) => {
      if (node.type !== SuperBlocks.TASK) return

      return {
        type: SuperBlocks.TASK,
        status: el.getAttribute('data-slate-value')
      }
    }
  },
  component: withSuperBlockElement(TaskSuperBlock),
  isInline: false,
  isVoid: false
})
