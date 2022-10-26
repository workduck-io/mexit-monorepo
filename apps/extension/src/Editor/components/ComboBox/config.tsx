import { PlatePlugin, PlatePluginComponent } from '@udecode/plate'
import { useMemoizedPlugins, generatePlugins } from '../../plugins'
import { QuickLinkComboboxItem } from '../../plugins/QuickLink/components/QuickLinkComboboxItem'
import { ELEMENT_ILINK, ELEMENT_TAG } from '@mexit/core'
import useMultiComboboxOnChange from '../MultiCombobox/useMultiComboboxChange'
import useMultiComboboxOnKeyDown from '../MultiCombobox/useMultiComboboxOnKeyDown'
import { SlashComboboxItem } from '../SlashCommands/SlashComboboxItem'
import { TagComboboxItem } from '../Tags/TagComboboxItem'
import { ComboboxConfig, ComboboxKey, ComboboxKeyDownConfig, ComboboxOnChangeConfig } from './types'

export const useComboboxConfig = (
  editorId: string,
  config: ComboboxConfig,
  components: Record<string, PlatePluginComponent<any | undefined>> = {},
  customPlugins?: Array<PlatePlugin>
) => {
  const keys = config.onKeyDownConfig.keys

  const comboOnKeydownConfig: ComboboxKeyDownConfig = {
    keys: {
      ilink: {
        slateElementType: ELEMENT_ILINK,
        newItemHandler: keys.ilink.newItemHandler,
        itemRenderer: QuickLinkComboboxItem
      },
      tag: {
        slateElementType: ELEMENT_TAG,
        newItemHandler: keys.tag.newItemHandler,
        itemRenderer: TagComboboxItem
      },
      slash_command: {
        slateElementType: 'slash_command',
        newItemHandler: keys.slash_command.newItemHandler,
        itemRenderer: SlashComboboxItem
      }
    },
    slashCommands: config.onKeyDownConfig.slashCommands
  }

  const comboOnChangeConfig: ComboboxOnChangeConfig = {
    ilink: {
      cbKey: ComboboxKey.ILINK,
      trigger: '[[',
      data: []
    },
    tag: {
      cbKey: ComboboxKey.TAG,
      trigger: '#',
      data: [],
      icon: 'ri:hashtag'
    },
    slash_command: {
      cbKey: ComboboxKey.SLASH_COMMAND,
      trigger: '/',
      icon: 'ri:flask-line',
      data: []
    },
    ...(config.onChangeConfig as any)
  }

  const prePlugins = useMemoizedPlugins(components)

  const plugins = [
    ...prePlugins,
    {
      key: 'MULTI_COMBOBOX',
      handlers: {
        onChange: useMultiComboboxOnChange(editorId, comboOnChangeConfig),
        onKeyDown: useMultiComboboxOnKeyDown(comboOnKeydownConfig)
      }
    }
  ]

  return {
    plugins,
    comboOnKeydownConfig
  }
}
