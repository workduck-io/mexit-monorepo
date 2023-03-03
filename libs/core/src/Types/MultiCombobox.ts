import { CategoryType, ComboboxKey, QuickLinkType } from './Editor'
import { MIcon } from './Store'

export interface ComboboxItem {
  text: string
  value: string
  icon?: MIcon
  type?: CategoryType | QuickLinkType

  /** Extended command -> Text after the command is part of it and used as arguments */
  extended?: boolean
}

export interface ComboboxType {
  cbKey: ComboboxKey
  icon?: MIcon
  trigger: string
  data?: ComboboxItem[]
  blockTrigger?: string
}

export interface ComboSearchType {
  textAfterTrigger: string
  textAfterBlockTrigger?: string
}
