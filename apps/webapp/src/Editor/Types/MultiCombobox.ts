import { BaseRange } from 'slate'
import { CategoryType, QuickLinkType } from '../constants'
import { ComboboxItemProps, ComboboxKey, RenderFunction, SlashCommandConfig } from './Combobox'

export interface ComboboxItem {
  text: string
  value: string
  icon?: string
  type?: CategoryType | QuickLinkType

  /** Extended command -> Text after the command is part of it and used as arguments */
  extended?: boolean
}

export interface ComboboxType {
  cbKey: ComboboxKey
  icon?: string
  trigger: string
  data?: ComboboxItem[]
  blockTrigger?: string
}

export interface ComboTriggerDataType {
  range: BaseRange
  search: ComboSearchType
  isBlockTriggered: boolean
  blockRange: BaseRange
  key: string
}

export interface ComboSearchType {
  textAfterTrigger: string
  textAfterBlockTrigger?: string
}
export interface ComboConfigData {
  keys: ConfigDataKeys
  slashCommands: ConfigDataSlashCommands
  internal: {
    ilink: SingleComboboxConfig
    commands: ConfigDataSlashCommands
  }
}

export interface ConfigDataKeys {
  [type: string]: SingleComboboxConfig
}

export interface ConfigDataSlashCommands {
  [type: string]: SlashCommandConfig
}
export interface SingleComboboxConfig {
  slateElementType: string
  newItemHandler: (newItem: string, parentId?: any) => any // eslint-disable-line @typescript-eslint/no-explicit-any
  // Called when an item is inserted, Not called when a new item is inserted, use newItemHandler to handle the new item case
  onItemInsert?: (item: string) => any // eslint-disable-line @typescript-eslint/no-explicit-any
  renderElement: RenderFunction<ComboboxItemProps>
}

export interface ComboOnKeyDownConfig {
  keys: ConfigDataKeys
  slashCommands: ConfigDataSlashCommands
  internal: {
    ilink: SingleComboboxConfig
    commands: ConfigDataSlashCommands
  }
}

export type ComboOnChangeConfig = Record<string, ComboboxType>

export interface ComboboxConfig {
  onKeyDownConfig: ComboOnKeyDownConfig
  onChangeConfig: ComboOnChangeConfig
}
