import { Value } from '@udecode/plate'
import {
  getPluginType,
  HotkeyPlugin,
  KeyboardHandlerReturnType,
  PlateEditor,
  toggleNodeType,
  WithPlatePlugin
} from '@udecode/plate-core'
import isHotkey from 'is-hotkey'
import { castArray } from 'lodash'

import { SuperBlocks } from '@mexit/core'

export const onKeyDownToggleElement =
  <V extends Value = Value, E extends PlateEditor<V> = PlateEditor<V>>(
    editor: E,
    { type, options: { hotkey } }: WithPlatePlugin<HotkeyPlugin, V, E>
  ): KeyboardHandlerReturnType =>
  (e) => {
    if (e.defaultPrevented) return

    const defaultType = getPluginType(editor, SuperBlocks.CONTENT)

    if (!hotkey) return

    const hotkeys = castArray(hotkey)

    for (const _hotkey of hotkeys) {
      if (isHotkey(_hotkey, e as any)) {
        e.preventDefault()
        toggleNodeType(editor, {
          activeType: type,
          inactiveType: defaultType
        })
        return
      }
    }
  }
