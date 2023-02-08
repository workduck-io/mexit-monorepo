import { PlatePluginComponent } from '@udecode/plate'

import { ContextMenuType, useLayoutStore } from '../../../Stores/useLayoutStore'
import { PluginOptionType, useEditorPlugins } from '../../Plugins/index'
import { ComboboxConfig } from '../../Types/MultiCombobox'
import useMultiComboboxOnChange from '../MultiCombobox/useMultiComboboxChange'
import useMultiComboboxOnKeyDown from '../MultiCombobox/useMultiComboboxOnKeyDown'

export const useComboboxConfig = (
  editorId: string,
  config: ComboboxConfig,
  components: Record<string, PlatePluginComponent<any | undefined>> = {},
  pluginOptions: PluginOptionType = { exclude: { dnd: false } }
) => {
  const setContextMenu = useLayoutStore((store) => store.setContextMenu)

  const pluginConfigs = {
    combobox: {
      onChange: useMultiComboboxOnChange(editorId, config.onChangeConfig),

      onKeyDown: useMultiComboboxOnKeyDown(config.onKeyDownConfig)
    }
  }

  const prePlugins = useEditorPlugins(components, pluginOptions)
  const plugins = [
    ...prePlugins,
    {
      key: 'MULTI_COMBOBOX',
      handlers: {
        onContextMenu: () => (e) => {
          e.preventDefault()
          setContextMenu({
            type: ContextMenuType.EDITOR,
            item: undefined,
            coords: {
              x: e.clientX,
              y: e.clientY
            }
          })
        },
        onChange: pluginConfigs.combobox.onChange,
        onKeyDown: pluginConfigs.combobox.onKeyDown
      }
    }
  ]

  return {
    plugins,
    comboConfigData: config.onKeyDownConfig
  }
}
