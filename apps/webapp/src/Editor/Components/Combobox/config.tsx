import { PlatePlugin, PlatePluginComponent } from '@udecode/plate'
import { useContextMenu } from 'react-contexify'
import useMemoizedPlugins from '../../Plugins/index'
import { ComboboxConfig } from '../../Types/MultiCombobox'
import { MENU_ID } from '../BlockContextMenu'

import useMultiComboboxOnChange from '../MultiCombobox/useMultiComboboxChange'
import useMultiComboboxOnKeyDown from '../MultiCombobox/useMultiComboboxOnKeyDown'

export const useComboboxConfig = (
  editorId: string,
  config: ComboboxConfig,
  components: Record<string, PlatePluginComponent<any | undefined>> = {}
) => {
  const pluginConfigs = {
    combobox: {
      onChange: useMultiComboboxOnChange(editorId, config.onChangeConfig),

      onKeyDown: useMultiComboboxOnKeyDown(config.onKeyDownConfig)
    }
  }

  const { show } = useContextMenu({ id: MENU_ID })

  const prePlugins = useMemoizedPlugins(components)
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
