import {
  createPluginFactory,
  HotkeyPlugin,
  onKeyDownToggleElement
  // PlateEditor,
  // WithOverride
} from '@udecode/plate-core'

import { ELEMENT_TODO_LI } from '@mexit/core'

export const createTodoPlugin = createPluginFactory<HotkeyPlugin>({
  key: ELEMENT_TODO_LI,
  isElement: true,
  handlers: {
    onKeyDown: onKeyDownToggleElement
  },
  options: {
    hotkey: ['mod+opt+4', 'mod+shift+4']
  },
  // withOverrides: withTodos,
  deserializeHtml: {
    attributeNames: ['data-nodeid'],
    getNode: (el, node) => {
      if (node['type'] !== ELEMENT_TODO_LI) return

      return {
        id: el.id,
        type: node['type'],
        nodeid: el.getAttribute('data-nodeid'),
        checked: el.getAttribute('data-slate-value')
      }
    }
  }
})
