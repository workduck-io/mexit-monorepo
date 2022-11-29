import { PlatePluginComponent } from '@udecode/plate'
import { useContextMenu } from 'react-contexify'

import { PluginOptionType,useEditorPlugins } from '../../Plugins/index'
import { ComboboxConfig } from '../../Types/MultiCombobox'
import { MENU_ID } from '../BlockContextMenu'
import useMultiComboboxOnChange from '../MultiCombobox/useMultiComboboxChange'
import useMultiComboboxOnKeyDown from '../MultiCombobox/useMultiComboboxOnKeyDown'

export const useComboboxConfig = (
  editorId: string,
  config: ComboboxConfig,
  components: Record<string, PlatePluginComponent<any | undefined>> = {},
  pluginOptions: PluginOptionType = { exclude: { dnd: false } }
) => {
  const pluginConfigs = {
    combobox: {
      onChange: useMultiComboboxOnChange(editorId, config.onChangeConfig),

      onKeyDown: useMultiComboboxOnKeyDown(config.onKeyDownConfig)
    }
  }

  const { show } = useContextMenu({ id: MENU_ID })

  const prePlugins = useEditorPlugins(components, pluginOptions)
  const plugins = [
    ...prePlugins,
    {
      key: 'MULTI_COMBOBOX',
      handlers: {
        onContextMenu: () => (ev) => {
          show(ev)
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
