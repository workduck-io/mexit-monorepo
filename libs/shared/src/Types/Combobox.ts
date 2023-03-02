import { BaseRange } from 'slate'

import { CategoryType, QuickLinkType } from '@mexit/core'

export interface ComboboxItem {
  text: string
  value: string
  icon?: string
  type?: QuickLinkType | CategoryType

  /** Extended command -> Text after the command is part of it and used as arguments */
  extended?: boolean
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
