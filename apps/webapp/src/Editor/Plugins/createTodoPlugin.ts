import {
  createPluginFactory,
  getPlateEditorRef,
  HotkeyPlugin,
  PlateEditor,
  Value,
  WithPlatePlugin
} from '@udecode/plate'

import { ELEMENT_TODO_LI } from '@mexit/core'

import { onKeyDownToggleElement } from '../Utils/onKeyDownToggleElement'

export const withTodoList = <V extends Value = Value, E extends PlateEditor<V> = PlateEditor<V>>(
  editor: E,
  { options }: WithPlatePlugin<any, V, E>
) => {
  const e = getPlateEditorRef()

  return editor
}

export const createTodoPlugin = createPluginFactory<HotkeyPlugin>({
  key: ELEMENT_TODO_LI,
  isElement: true,
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
  },
  handlers: {
    onKeyDown: onKeyDownToggleElement
  },
  options: {
    hotkey: ['mod+opt+4', 'mod+shift+4']
  }
})
