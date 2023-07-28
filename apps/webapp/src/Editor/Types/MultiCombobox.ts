import { BaseRange } from 'slate'

import { ComboboxType } from '@mexit/core'

import { ComboboxItemProps, RenderFunction, SlashCommandConfig } from './Combobox'

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
  newItemHandler: (newItem: string, parentId?: any, editor?: any) => any // eslint-disable-line @typescript-eslint/no-explicit-any
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
