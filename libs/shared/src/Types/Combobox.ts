import { CategoryType, ComboboxKey, QuickLinkType } from '@mexit/core'

import { BaseRange, Point } from 'slate'

export interface ComboboxItem {
  text: string
  value: string
  icon?: string
  type?: QuickLinkType | CategoryType

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

export type ComboTriggerType = ComboboxType & { at?: Point; blockAt?: Point }
