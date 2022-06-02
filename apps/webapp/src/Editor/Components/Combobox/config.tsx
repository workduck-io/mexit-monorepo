import { PlatePlugin, PlatePluginComponent } from '@udecode/plate'
import useMemoizedPlugins, { generatePlugins } from '../../Plugins/index'
import { ComboboxConfig } from '../../Types/MultiCombobox'

import useMultiComboboxOnChange from '../MultiCombobox/useMultiComboboxChange'
import useMultiComboboxOnKeyDown from '../MultiCombobox/useMultiComboboxOnKeyDown'

export const useComboboxConfig = (
  editorId: string,
  config: ComboboxConfig,
  components: Record<string, PlatePluginComponent<any | undefined>> = {},
  customPlugins?: Array<PlatePlugin>
) => {
  const prePlugins = useMemoizedPlugins(customPlugins ?? generatePlugins(), components)

  const plugins = [
    ...prePlugins,
    {
      key: 'MULTI_COMBOBOX',
      handlers: {
        onChange: useMultiComboboxOnChange(editorId, config.onChangeConfig),
        onKeyDown: useMultiComboboxOnKeyDown(config.onKeyDownConfig)
      }
    }
  ]

  return {
    plugins,
    comboConfigData: config.onKeyDownConfig
  }
}
