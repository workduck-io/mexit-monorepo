import { BaseRange } from 'slate'

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
